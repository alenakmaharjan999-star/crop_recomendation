import os
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import joblib
import numpy as np
import pandas as pd

# ============================================================
# CHANGE 1: ADD THIS IMPORT (keep other imports as is)
# ============================================================
from metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report
)

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key")
CORS(app)

# Load the trained model and scaler once at startup
FEATURE_ORDER = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

# Mapping for .NET field names to Python field names
FIELD_MAPPING = {
    "nitrogen": "N",
    "phosphorus": "P",
    "potassium": "K",
    "ph": "ph",
    "temperature": "temperature",
    "humidity": "humidity",
    "rainfall": "rainfall"
}

# Accepted input range per feature
FEATURE_RANGES = {
    "N": (0.0, 140.0),
    "P": (0.0, 140.0),
    "K": (0.0, 205.0),
    "temperature": (-30.0, 60.0),
    "humidity": (0.0, 100.0),
    "ph": (0.0, 14.0),
    "rainfall": (0.0, 1000.0),
}

model = joblib.load(BASE_DIR / "crop_model.pkl")
scaler = joblib.load(BASE_DIR / "scaler.pkl")

# ============================================================
# CHANGE 2: ADD THIS AFTER LOADING MODEL AND SCALER
# ============================================================
print("📊 Calculating model metrics...")
try:
    df = pd.read_csv(BASE_DIR / "Dataset/Crop_recommendation5000.csv")
    X = df[FEATURE_ORDER]
    y = df['label']
    X_scaled = scaler.transform(X)
    y_pred = model.predict(X_scaled)

    # Calculate metrics
    accuracy = accuracy_score(y, y_pred)
    precision = precision_score(y, y_pred, average='weighted')
    recall = recall_score(y, y_pred, average='weighted')
    f1 = f1_score(y, y_pred, average='weighted')

    # Get confusion matrix and labels
    cm, labels = confusion_matrix(y, y_pred)

    # Get classification report
    report = classification_report(y, y_pred)

    # Store all metrics
    MODEL_METRICS = {
        'accuracy': float(accuracy),
        'precision': float(precision),
        'recall': float(recall),
        'f1_score': float(f1),
        'confusion_matrix': {
            'labels': [str(label) for label in labels[:5]],  # First 5 classes
            'matrix': cm[:5, :5].tolist() if len(labels) > 5 else cm.tolist()
        },
        'classification_report': report,
        'total_samples': len(y),
        'n_classes': len(labels)
    }
    print(f"✅ Metrics calculated! Accuracy: {accuracy:.4f}")

except Exception as e:
    print(f"⚠️ Could not calculate metrics: {e}")
    MODEL_METRICS = {
        'accuracy': None,
        'precision': None,
        'recall': None,
        'f1_score': None,
        'confusion_matrix': None,
        'classification_report': "Metrics not available",
        'total_samples': 0,
        'n_classes': 0
    }


def parse_features(data):
    """Returns (values, errors) for the incoming request payload."""
    values = []
    errors = {}

    # Handle .NET naming convention
    if "nitrogen" in data:
        mapped_data = {}
        for dotnet_field, python_field in FIELD_MAPPING.items():
            if dotnet_field in data:
                mapped_data[python_field] = data[dotnet_field]
        data = mapped_data

    for field in FEATURE_ORDER:
        if field not in data or data[field] is None or data[field] == "":
            errors[field] = f"{field} is required"
            continue

        try:
            value = float(data[field])
        except (ValueError, TypeError):
            errors[field] = f"{field} must be a number"
            continue

        if not np.isfinite(value):
            errors[field] = f"{field} must be a finite number"
            continue

        low, high = FEATURE_RANGES[field]
        if value < low or value > high:
            errors[field] = f"{field} must be between {low:g} and {high:g}"
            continue

        values.append(value)

    return values, errors


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}

    values, errors = parse_features(data)
    if errors:
        return jsonify({"error": "Invalid or missing input fields", "errors": errors}), 400

    features_df = pd.DataFrame([values], columns=FEATURE_ORDER)

    try:
        scaled_features = scaler.transform(features_df)
        prediction = model.predict(scaled_features)[0]
        confidence = None
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(scaled_features)[0]
            confidence = float(np.max(probabilities))
    except Exception as exc:
        app.logger.exception("Prediction failed")
        return jsonify({"error": f"Prediction failed: {exc}"}), 500

    # ============================================================
    # CHANGE 3: MODIFY THIS RETURN STATEMENT
    # ============================================================
    response = {
        "recommended_crop": str(prediction),
        "confidence": confidence,
        "model_performance": MODEL_METRICS  # This adds all metrics
    }
    return jsonify(response)


# ✅ ADD THIS NEW ENDPOINT HERE
@app.route("/metrics", methods=["GET"])
def get_metrics():
    """Endpoint to get model performance metrics"""
    return jsonify({
        "status": "success",
        "metrics": MODEL_METRICS
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(port=port, debug=True)