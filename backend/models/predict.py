import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH    = os.path.join(BASE_DIR, "saved_model", "model.pkl")
SCALER_PATH   = os.path.join(BASE_DIR, "saved_model", "scaler.pkl")
FEATURE_PATH  = os.path.join(BASE_DIR, "saved_model", "feature_names.pkl")
ACCURACY_PATH = os.path.join(BASE_DIR, "saved_model", "accuracy.pkl")

model         = joblib.load(MODEL_PATH)
scaler        = joblib.load(SCALER_PATH)
feature_names = joblib.load(FEATURE_PATH)
THRESHOLD     = joblib.load(os.path.join(BASE_DIR, "saved_model", "threshold.pkl"))

# ✅ Load accuracy safely
try:
    MODEL_ACCURACY = float(joblib.load(ACCURACY_PATH))
except Exception:
    MODEL_ACCURACY = 0.8896  # fallback if file not found


def preprocess(df):
    binary_cols = [
        "Smoking", "AlcoholDrinking", "Stroke", "DiffWalking",
        "PhysicalActivity", "Asthma", "KidneyDisease", "SkinCancer"
    ]

    for col in binary_cols:
        if col in df.columns:
            df[col] = df[col].map({"Yes": 1, "No": 0})

    if "Sex" in df.columns:
        df["Sex"] = df["Sex"].map({"Male": 1, "Female": 0})

    if "Diabetic" in df.columns:
        df["Diabetic"] = df["Diabetic"].map({
            "Yes": 1, "No": 0,
            "Yes (during pregnancy)": 1,
            "No, borderline diabetes": 0
        })

    df = pd.get_dummies(df, columns=["AgeCategory", "Race", "GenHealth"])

    for col in feature_names:
        if col not in df.columns:
            df[col] = 0

    return df[feature_names]


def predict(input_data: dict) -> dict:
    df = pd.DataFrame([input_data])
    df = preprocess(df)

    X    = scaler.transform(df)
    prob = model.predict_proba(X)[0][1]

    probability = round(float(prob) * 100, 2)

    # Risk level
    if probability < 30:
        risk_level = "Low"
    elif probability < 70:
        risk_level = "Moderate"
    else:
        risk_level = "High"

    # ✅ Risk factors
    risk_factors = []

    if input_data.get("Smoking") == "Yes":
        risk_factors.append("Smoking")

    if input_data.get("BMI", 0) > 30:
        risk_factors.append("High BMI")

    if input_data.get("Stroke") == "Yes":
        risk_factors.append("History of Stroke")

    if input_data.get("Diabetic") in ["Yes", "Yes (during pregnancy)"]:
        risk_factors.append("Diabetes")

    if input_data.get("PhysicalActivity") == "No":
        risk_factors.append("Low Physical Activity")

    if input_data.get("AlcoholDrinking") == "Yes":
        risk_factors.append("Alcohol Drinking")

    if input_data.get("KidneyDisease") == "Yes":
        risk_factors.append("Kidney Disease")

    if input_data.get("DiffWalking") == "Yes":
        risk_factors.append("Difficulty Walking")

    age = input_data.get("AgeCategory", "")
    if age in ["65-69", "70-74", "75-79", "80 or older"]:
        risk_factors.append("Advanced Age")

    if input_data.get("GenHealth") in ["Poor", "Fair"]:
        risk_factors.append("Poor General Health")

    if not risk_factors:
        risk_factors = ["No major risk factors detected"]

    return {
        "riskLevel":     risk_level,
        "probability":   probability,
        "riskFactors":   risk_factors,
        "modelAccuracy": MODEL_ACCURACY,  # ✅ Real accuracy from training
    }