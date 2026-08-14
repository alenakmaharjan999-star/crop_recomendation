import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import matplotlib.pyplot as plt
# Import custom implementations
from custom_random_forest import RandomForest
from metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, confusion_matrix_display
)

FEATURE_ORDER = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']

# ============================================================
# 1. LOAD DATA
# ============================================================
print("📊 Loading dataset...")
df = pd.read_csv("Dataset/Crop_recommendation5000.csv")
X = df[FEATURE_ORDER]
y = df['label']

print(f"   Dataset shape: {df.shape}")
print(f"   Crops: {y.nunique()}")
print(f"   Features: {FEATURE_ORDER}")

# ============================================================
# 2. TRAIN/TEST SPLIT
# ============================================================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ============================================================
# 3. SCALE FEATURES
# ============================================================
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ============================================================
# 4. TRAIN CUSTOM RANDOM FOREST
# ============================================================
print("\n🌳 Training Custom Random Forest from Scratch...")

# Define hyperparameters (simpler - no grid search needed)
params = {
    'n_estimators': 100,  # Number of trees
    'max_depth': 20,  # Maximum tree depth
    'min_samples_split': 2,  # Minimum samples to split
    'min_samples_leaf': 1,  # Minimum samples in leaf
    'criterion': 'gini',  # Split criterion
    'max_features': 'sqrt',  # Features per split
    'random_state': 42  # For reproducibility
}

print("\n📋 Hyperparameters:")
for key, value in params.items():
    print(f"   {key}: {value}")

# Create and train custom Random Forest
rf = RandomForest(**params)
rf.fit(X_train_scaled, y_train)

best_model = rf  # Use our custom model
print(f"\n✅ Training complete with {params['n_estimators']} trees")

# ============================================================
# 5. EVALUATE ON TEST SET (Using Custom Metrics)
# ============================================================
print("\n📊 Evaluating on test set...")

# Get predictions
y_pred = best_model.predict(X_test_scaled)

# Calculate metrics manually
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='weighted')
recall = recall_score(y_test, y_pred, average='weighted')
f1 = f1_score(y_test, y_pred, average='weighted')

print(f"\n📈 Overall Metrics:")
print(f"   Accuracy:  {accuracy:.4f} ({accuracy * 100:.2f}%)")
print(f"   Precision: {precision:.4f}")
print(f"   Recall:    {recall:.4f}")
print(f"   F1-Score:  {f1:.4f}")

# Confusion Matrix
cm, labels = confusion_matrix(y_test, y_pred)
print("\n🔢 Confusion Matrix (First 5 classes):")
print("   (Rows: Actual, Columns: Predicted)")
for i in range(min(5, len(labels))):
    row = f"   {str(labels[i]):<10} " + " ".join([f"{cm[i][j]:>4}" for j in range(min(5, len(labels)))])
    print(row)
if len(labels) > 5:
    print("   ... (showing first 5 classes only)")

# Classification Report
print("\n📋 Classification Report:")
report = classification_report(y_test, y_pred)
print(report)

# ============================================================
# 6. FEATURE IMPORTANCE
# ============================================================
print("\n📈 Feature Importance:")
importances = best_model.feature_importances_
for name, imp in zip(FEATURE_ORDER, importances):
    bars = '█' * int(imp * 50)
    print(f"   {name:<12}: {imp:.3f}  {bars}")

# ============================================================
# 7. CONFIDENCE ANALYSIS (NEW!)
# ============================================================
print("\n" + "=" * 60)
print("🎯 CONFIDENCE ANALYSIS")
print("=" * 60)

# Get probabilities for test set
if hasattr(best_model, "predict_proba"):
    probas = best_model.predict_proba(X_test_scaled)
    confidences = np.max(probas, axis=1)

    print(f"\nConfidence Statistics:")
    print(f"   Mean confidence:  {np.mean(confidences):.4f}")
    print(f"   Min confidence:   {np.min(confidences):.4f}")
    print(f"   Max confidence:   {np.max(confidences):.4f}")
    print(f"   Std confidence:   {np.std(confidences):.4f}")

    # Confidence distribution
    bins = np.linspace(0, 1, 11)
    hist, _ = np.histogram(confidences, bins=bins)
    print("\nConfidence Distribution:")
    for i in range(len(hist)):
        if hist[i] > 0:
            bar = '█' * int(hist[i] / np.max(hist) * 40)
            print(f"   {bins[i]:.1f}-{bins[i + 1]:.1f}: {bar} ({hist[i]})")

    # Show sample predictions with confidence
    print("\n📊 Sample Predictions with Confidence:")
    sample_indices = np.random.choice(len(X_test), min(5, len(X_test)), replace=False)
    for idx in sample_indices:
        actual = y_test.iloc[idx]
        predicted = y_pred[idx]
        confidence = confidences[idx]
        print(f"   Actual: {actual:<12} → Predicted: {predicted:<12} (Confidence: {confidence:.4f})")

    # Show any low confidence predictions
    low_conf_indices = np.where(confidences < 0.9)[0]
    if len(low_conf_indices) > 0:
        print(f"\n⚠️ Low confidence predictions (<0.9): {len(low_conf_indices)}")
        for idx in low_conf_indices[:3]:
            actual = y_test.iloc[idx]
            predicted = y_pred[idx]
            confidence = confidences[idx]
            print(f"   Actual: {actual:<12} → Predicted: {predicted:<12} (Confidence: {confidence:.4f})")
else:
    print("⚠️ Model does not support probability predictions")

# ============================================================
# 8. SAVE MODEL AND SCALER
# ============================================================
print("\n💾 Saving model...")
joblib.dump(best_model, "crop_model.pkl")
joblib.dump(scaler, "scaler.pkl")
print("✅ Model saved as crop_model.pkl")
print("✅ Scaler saved as scaler.pkl")

# ============================================================
# 9. FEATURE IMPORTANCE PLOT
# ============================================================
plt.figure(figsize=(10, 6))
plt.barh(FEATURE_ORDER, importances, color='skyblue')
plt.xlabel('Importance Score')
plt.title('Custom Random Forest - Feature Importance')
plt.tight_layout()
plt.savefig('feature_importance.png', dpi=300, bbox_inches='tight')
print("✅ Feature importance plot saved as feature_importance.png")

# ============================================================
# 10. CONFUSION MATRIX VISUALIZATION (Optional)
# ============================================================
print("\n📊 Creating Confusion Matrix Visualization...")
try:
    import seaborn as sns

    plt.figure(figsize=(12, 10))
    cm_display = np.array(cm)
    # Show only top 10 crops for readability
    top_10_labels = labels[:10]
    top_10_cm = cm_display[:10, :10]
    sns.heatmap(top_10_cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=top_10_labels, yticklabels=top_10_labels)
    plt.title('Confusion Matrix (Top 10 Crops)')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.tight_layout()
    plt.savefig('confusion_matrix.png', dpi=300, bbox_inches='tight')
    print("✅ Confusion matrix saved as 'confusion_matrix.png'")
except ImportError:
    print("⚠️ Seaborn not installed. Skipping confusion matrix visualization.")