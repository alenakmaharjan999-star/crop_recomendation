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
model = joblib.load(BASE_DIR / "crop_model.pkl")
scaler = joblib.load(BASE_DIR / "scaler.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}

    try:
        values = [float(data[field]) for field in FEATURE_ORDER]
    except (KeyError, ValueError, TypeError):
        return jsonify({"error": "Invalid or missing input fields"}), 400

    features_df = pd.DataFrame([values], columns=FEATURE_ORDER)
    scaled_features = scaler.transform(features_df)
    prediction = model.predict(scaled_features)[0]

    return jsonify({"recommended_crop": str(prediction)})

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(port=port, debug=True)
