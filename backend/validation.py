def require_json_object(data):
    if not isinstance(data, dict):
        raise ValueError("JSON object payload is required.")


def validate_auth_payload(data, mode="login"):
    require_json_object(data)

    if mode == "register":
        name = str(data.get("name", "")).strip()
        if not name:
            raise ValueError("Name is required.")

    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not email or "@" not in email:
        raise ValueError("Valid email is required.")
    if not password:
        raise ValueError("Password is required.")
    if mode == "register" and len(password) < 8:
        raise ValueError("Password must be at least 8 characters.")


def validate_prediction_payload(data):
    require_json_object(data)

    required_fields = [
        "BMI", "Smoking", "AlcoholDrinking", "Stroke", "PhysicalHealth", "MentalHealth", "DiffWalking",
        "Sex", "AgeCategory", "Race", "Diabetic", "PhysicalActivity", "GenHealth", "SleepTime",
        "Asthma", "KidneyDisease", "SkinCancer",
    ]

    missing = [field for field in required_fields if field not in data]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")

    yes_no_fields = [
        "Smoking", "AlcoholDrinking", "Stroke", "DiffWalking", "PhysicalActivity", "Asthma", "KidneyDisease", "SkinCancer",
    ]
    for field in yes_no_fields:
        if data.get(field) not in {"Yes", "No"}:
            raise ValueError(f"{field} must be 'Yes' or 'No'.")

    if data.get("Sex") not in {"Male", "Female"}:
        raise ValueError("Sex must be 'Male' or 'Female'.")

    try:
        bmi = float(data.get("BMI"))
        sleep = float(data.get("SleepTime"))
        physical = float(data.get("PhysicalHealth"))
        mental = float(data.get("MentalHealth"))
    except (TypeError, ValueError):
        raise ValueError("BMI, SleepTime, PhysicalHealth, and MentalHealth must be numeric.")

    if not (10 <= bmi <= 100):
        raise ValueError("BMI must be between 10 and 100.")
    if not (0 <= physical <= 30):
        raise ValueError("PhysicalHealth must be between 0 and 30.")
    if not (0 <= mental <= 30):
        raise ValueError("MentalHealth must be between 0 and 30.")
    if not (1 <= sleep <= 24):
        raise ValueError("SleepTime must be between 1 and 24.")