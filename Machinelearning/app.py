import os
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import joblib
import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key")
CORS(app)

# Load the trained model and scaler once at startup
FEATURE_ORDER = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

# Accepted input range per feature, aligned with the training dataset.
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


def parse_features(data):
    """Returns (values, errors) for the incoming request payload."""
    values = []
    errors = {}

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
    except Exception as exc:  # model/scaler failure — surface as a server error
        app.logger.exception("Prediction failed")
        return jsonify({"error": f"Prediction failed: {exc}"}), 500

    return jsonify({"recommended_crop": str(prediction), "confidence": confidence})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(port=port, debug=True)
