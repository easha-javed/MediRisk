import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    classification_report,
    accuracy_score,
    roc_auc_score,
    confusion_matrix,
    precision_score,
    recall_score,
    f1_score
)
from imblearn.over_sampling import SMOTE
import joblib
import os

# 1. LOAD DATA
print("Loading dataset...")
df = pd.read_csv("data/heart_disease.csv")
df.columns = df.columns.str.strip()

target_col = "HeartDisease"

# 2. PREPROCESSING
yes_no_cols = [col for col in df.columns if df[col].dropna().isin(["Yes", "No"]).all()]
for col in yes_no_cols:
    df[col] = df[col].map({"No": 0, "Yes": 1})

cat_cols = df.select_dtypes(include=["object"]).columns.tolist()
df = pd.get_dummies(df, columns=cat_cols)

print("After encoding:", df.shape)

# 3. FEATURES
X = df.drop(columns=[target_col])
y = df[target_col]

feature_names = list(X.columns)

print("\nClass Distribution:")
print(y.value_counts())

# 4. SPLIT
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 5. SCALE
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test  = scaler.transform(X_test)

# 6. SMOTE
print("\nApplying SMOTE...")
sm = SMOTE(random_state=42)
X_train, y_train = sm.fit_resample(X_train, y_train)

# 7. TRAIN MODEL
print("\nTraining model...")

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    min_samples_split=15,
    min_samples_leaf=5,
    class_weight="balanced_subsample",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# 8. EVALUATION
print("\nEvaluation:")

y_prob = model.predict_proba(X_test)[:, 1]

THRESHOLD = 0.65
y_pred = (y_prob >= THRESHOLD).astype(int)

accuracy = float(accuracy_score(y_test, y_pred))  # ✅ Save accuracy as float

print("\nThreshold:", THRESHOLD)
print("Accuracy :", accuracy)
print("ROC-AUC  :", roc_auc_score(y_test, y_prob))

print("\nKey Metrics:")
print("Precision:", precision_score(y_test, y_pred))
print("Recall   :", recall_score(y_test, y_pred))
print("F1 Score :", f1_score(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# 9. SAVE
os.makedirs("saved_model", exist_ok=True)

joblib.dump(model,         "saved_model/model.pkl")
joblib.dump(scaler,        "saved_model/scaler.pkl")
joblib.dump(feature_names, "saved_model/feature_names.pkl")
joblib.dump(THRESHOLD,     "saved_model/threshold.pkl")
joblib.dump(accuracy,      "saved_model/accuracy.pkl")  # ✅ Save accuracy

print("\nModel saved successfully.")
print(f"Accuracy saved: {accuracy:.4f}")