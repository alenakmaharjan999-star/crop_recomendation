# fertilizer_data.py
# NPK Requirements for 22 Crops (Official NARC Recommendations)

CROP_NPK_REQUIREMENTS = {
    # CEREALS
    "rice": {"N": 120, "P": 60, "K": 40},
    "maize": {"N": 120, "P": 60, "K": 40},

    # PULSES
    "chickpea": {"N": 40, "P": 40, "K": 40},
    "kidneybeans": {"N": 40, "P": 40, "K": 40},
    "pigeonpeas": {"N": 30, "P": 30, "K": 30},
    "mothbeans": {"N": 30, "P": 30, "K": 30},
    "mungbean": {"N": 30, "P": 30, "K": 30},
    "blackgram": {"N": 30, "P": 30, "K": 40},
    "lentil": {"N": 30, "P": 30, "K": 30},

    # FRUITS
    "pomegranate": {"N": 80, "P": 40, "K": 60},
    "banana": {"N": 200, "P": 60, "K": 300},
    "mango": {"N": 150, "P": 50, "K": 100},
    "grapes": {"N": 80, "P": 40, "K": 80},
    "watermelon": {"N": 80, "P": 40, "K": 60},
    "muskmelon": {"N": 80, "P": 40, "K": 60},
    "apple": {"N": 80, "P": 40, "K": 60},
    "orange": {"N": 100, "P": 50, "K": 80},
    "papaya": {"N": 100, "P": 50, "K": 80},
    "coconut": {"N": 100, "P": 50, "K": 120},

    # CASH CROPS
    "cotton": {"N": 150, "P": 60, "K": 70},
    "jute": {"N": 80, "P": 40, "K": 40},
    "coffee": {"N": 100, "P": 60, "K": 80}
}

# Available fertilizers with their NPK percentages
FERTILIZERS = [
    {"name": "Urea", "N": 46, "P": 0, "K": 0},
    {"name": "DAP", "N": 18, "P": 46, "K": 0},
    {"name": "MOP", "N": 0, "P": 0, "K": 60},
    {"name": "SSP", "N": 0, "P": 16, "K": 0},
    {"name": "NPK 20-20-20", "N": 20, "P": 20, "K": 20},
    {"name": "NPK 15-15-15", "N": 15, "P": 15, "K": 15},
    {"name": "NPK 10-26-26", "N": 10, "P": 26, "K": 26},
    {"name": "NPK 12-12-17", "N": 12, "P": 12, "K": 17},
    {"name": "NPK 17-17-17", "N": 17, "P": 17, "K": 17},
]