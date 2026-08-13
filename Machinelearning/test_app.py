import unittest
from pathlib import Path
import numpy as np
import joblib

from app import app, FEATURE_ORDER

BASE_DIR = Path(__file__).resolve().parent

class PredictEndpointTest(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.client = app.test_client()
        self.model = joblib.load(BASE_DIR / "crop_model.pkl")
        self.scaler = joblib.load(BASE_DIR / "scaler.pkl")

    def test_predict_endpoint_uses_feature_order_and_scaler(self):
        # Provide input in an arbitrary JSON order and verify the output matches
        # the expected prediction from the same model/scaler pipeline.
        feature_values = [25.0, 15.0, 10.0, 28.0, 65.0, 6.2, 120.0]
        request_data = {
            "rainfall": feature_values[6],
            "ph": feature_values[5],
            "humidity": feature_values[4],
            "temperature": feature_values[3],
            "K": feature_values[2],
            "P": feature_values[1],
            "N": feature_values[0],
        }

        expected = self.model.predict(
            self.scaler.transform(np.array([feature_values], dtype=float))
        )[0]

        response = self.client.post("/predict", json=request_data)
        self.assertEqual(response.status_code, 200)

        json_data = response.get_json()
        self.assertIsInstance(json_data, dict)
        self.assertEqual(json_data.get("recommended_crop"), expected)

    def test_missing_input_fields_returns_error(self):
        response = self.client.post("/predict", json={"N": 10})
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.get_json())

    def test_out_of_range_values_are_rejected(self):
        payload = {
            "N": 500, "P": 42, "K": 43,
            "temperature": 21, "humidity": 82, "ph": 6.5, "rainfall": 203,
        }
        response = self.client.post("/predict", json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("N", response.get_json()["errors"])

    def test_prediction_varies_with_input_and_returns_confidence(self):
        rice = {
            "N": 90, "P": 42, "K": 43,
            "temperature": 21, "humidity": 82, "ph": 6.5, "rainfall": 203,
        }
        apple = {
            "N": 20, "P": 130, "K": 200,
            "temperature": 23, "humidity": 92, "ph": 5.9, "rainfall": 110,
        }

        first = self.client.post("/predict", json=rice).get_json()
        second = self.client.post("/predict", json=apple).get_json()

        self.assertNotEqual(first["recommended_crop"], second["recommended_crop"])
        for result in (first, second):
            self.assertGreater(result["confidence"], 0.0)
            self.assertLessEqual(result["confidence"], 1.0)


if __name__ == "__main__":
    unittest.main()
