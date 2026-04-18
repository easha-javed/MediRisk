from routes.chat import build_messages, build_offline_reply


def test_build_messages_deduplicates_latest_user_turn():
    history = [
        {"role": "assistant", "content": "hello"},
        {"role": "user", "content": "why is my risk high"},
    ]

    messages = build_messages("why is my risk high", history, {"riskLevel": "High"})

    user_turns = [m for m in messages if m.get("role") == "user"]
    assert len(user_turns) == 1


def test_offline_reply_contains_action_steps_when_user_asks_how():
    context = {
        "riskLevel": "Moderate",
        "probability": 64.2,
        "riskFactors": ["Smoking", "High BMI", "Low Physical Activity"],
        "formData": {"smoking": "Yes", "physicalActivity": "No", "bmi": "33"},
    }

    reply = build_offline_reply("How can I reduce my risk?", [], context)

    assert "Practical next steps" in reply
    assert "Quit smoking" in reply or "physical activity" in reply


def test_offline_reply_answers_identity_question_directly():
    reply = build_offline_reply("which ai are u", [], {})

    assert "MediRisk AI Assistant" in reply


def test_offline_reply_explains_diabetes_heart_link():
    context = {
        "riskLevel": "Moderate",
        "probability": 55.19,
        "riskFactors": ["Diabetes", "Poor General Health"],
        "formData": {},
    }

    reply = build_offline_reply("how is diabetes linked to heart disease", [], context)

    assert "blood sugar" in reply.lower()
    assert "heart disease" in reply.lower()


def test_offline_reply_explains_smoking_when_asked():
    context = {
        "riskLevel": "Moderate",
        "probability": 55.19,
        "riskFactors": ["Smoking"],
        "formData": {},
    }

    reply = build_offline_reply("explain smoking", [], context)

    assert "smoking" in reply.lower()
    assert "heart" in reply.lower()