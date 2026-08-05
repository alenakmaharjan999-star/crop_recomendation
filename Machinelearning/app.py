import os
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import joblib
import numpy as np

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key")
CORS(app)

# Load the trained model once at startup
model = joblib.load(BASE_DIR / "crop_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}

    try:
        N = float(data["N"])
        P = float(data["P"])
        K = float(data["K"])
        temperature = float(data["temperature"])
        humidity = float(data["humidity"])
        ph = float(data["ph"])
        rainfall = float(data["rainfall"])
    except (KeyError, ValueError):
        return jsonify({"error": "Invalid or missing input fields"}), 400

    features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    prediction = model.predict(features)[0]

    return jsonify({"recommended_crop": str(prediction)})

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(port=port, debug=True)
