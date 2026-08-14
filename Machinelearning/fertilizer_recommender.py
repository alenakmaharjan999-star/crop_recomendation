# fertilizer_recommender.py
import numpy as np
from fertilizer_data import CROP_NPK_REQUIREMENTS, FERTILIZERS


class FertilizerRecommender:
    def __init__(self):
        self.crop_requirements = CROP_NPK_REQUIREMENTS
        self.fertilizers = FERTILIZERS

    def calculate_deficit(self, soil_npk, crop_name):
        """
        Calculate NPK deficit based on soil nutrients and crop requirements
        """
        crop_name = crop_name.lower()

        if crop_name not in self.crop_requirements:
            return None

        required = self.crop_requirements[crop_name]

        deficit = {
            "N": max(0, required["N"] - soil_npk["N"]),
            "P": max(0, required["P"] - soil_npk["P"]),
            "K": max(0, required["K"] - soil_npk["K"])
        }

        return deficit

    def find_best_fertilizer(self, deficit):
        """
        Find the best fertilizer based on NPK deficit pattern
        """
        if deficit is None:
            return None

        deficit_vector = np.array([deficit["N"], deficit["P"], deficit["K"]])

        # If no deficit, return "No fertilizer needed"
        if np.sum(deficit_vector) == 0:
            return {
                "name": "No fertilizer needed",
                "reason": "Soil already has sufficient nutrients for this crop"
            }

        # Find which nutrient has the highest deficit
        nutrient_names = ["N", "P", "K"]
        max_deficit = max(deficit["N"], deficit["P"], deficit["K"])

        primary_nutrient = None
        if deficit["N"] == max_deficit and max_deficit > 0:
            primary_nutrient = "N"
        elif deficit["P"] == max_deficit and max_deficit > 0:
            primary_nutrient = "P"
        elif deficit["K"] == max_deficit and max_deficit > 0:
            primary_nutrient = "K"

        # Match to best fertilizer based on primary deficiency
        if primary_nutrient == "N":
            best_fertilizer = {"name": "Urea", "N": 46, "P": 0, "K": 0}
        elif primary_nutrient == "P":
            best_fertilizer = {"name": "Di-Ammonium Phosphate (DAP)", "N": 18, "P": 46, "K": 0}
        elif primary_nutrient == "K":
            best_fertilizer = {"name": "Muriate of Potash (MOP)", "N": 0, "P": 0, "K": 60}
        else:
            best_fertilizer = {"name": "NPK 20-20-20", "N": 20, "P": 20, "K": 20}

        # Calculate application rate
        rate = self.calculate_rate(deficit, best_fertilizer)

        return {
            "name": best_fertilizer["name"],
            "n_p_k": f"{best_fertilizer['N']}-{best_fertilizer['P']}-{best_fertilizer['K']}",
            "application_rate_kg_per_ha": rate,
            "deficient_nutrients": {
                "N": deficit["N"],
                "P": deficit["P"],
                "K": deficit["K"]
            }
        }

    def calculate_rate(self, deficit, fertilizer):
        """
        Calculate how much fertilizer to apply based on deficit
        """
        deficits = [deficit["N"], deficit["P"], deficit["K"]]
        max_deficit_value = max(deficits)

        if max_deficit_value == 0:
            return 0

        nutrient_names = ["N", "P", "K"]
        max_idx = np.argmax(deficits)
        nutrient = nutrient_names[max_idx]

        fert_percentage = fertilizer[nutrient] / 100

        if fert_percentage == 0:
            return int(max_deficit_value * 2)

        rate = max_deficit_value / fert_percentage
        return int(round(rate / 10) * 10)

    def get_recommendation(self, soil_npk, crop_name):
        """
        Get complete fertilizer recommendation
        """
        deficit = self.calculate_deficit(soil_npk, crop_name)

        if deficit is None:
            return {
                "error": f"No NPK requirements found for crop: {crop_name}"
            }

        recommendation = self.find_best_fertilizer(deficit)

        return {
            "crop": crop_name,
            "soil_npk": soil_npk,
            "crop_requirement": self.crop_requirements.get(crop_name.lower(), {}),
            "deficit": deficit,
            "recommendation": recommendation
        }