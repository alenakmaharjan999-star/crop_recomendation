import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
import joblib

FEATURE_ORDER = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']

# Load dataset and preserve feature order
df = pd.read_csv("Dataset/Crop_recommendation.csv")
X = df[FEATURE_ORDER]
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Fit a scaler on training data and save it for use in inference
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = DecisionTreeClassifier(criterion='entropy', max_depth=10, random_state=42)
model.fit(X_train_scaled, y_train)

y_pred = model.predict(X_test_scaled)
print("Accuracy:", accuracy_score(y_test, y_pred))

joblib.dump(model, "crop_model.pkl")
joblib.dump(scaler, "scaler.pkl")
print("Model saved as crop_model.pkl")
print("Scaler saved as scaler.pkl")