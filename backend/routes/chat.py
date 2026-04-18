import os
import re

import requests
from flask import Blueprint, request, jsonify
from security import require_auth

chat_bp = Blueprint("chat", __name__)


def build_system_prompt(context: dict) -> str:
    risk_level = context.get("riskLevel", "unknown")
    probability = context.get("probability", "unknown")
    risk_factors = context.get("riskFactors") or []
    form_data = context.get("formData") or {}

    return (
        "You are MediRisk AI Assistant. Respond like ChatGPT: natural, clear, and conversational. "
        "Prioritize directly answering the user's question first, then give concise actionable steps. "
        "Use the provided prediction context when relevant, and do not invent clinical facts. "
        "You are not a doctor: avoid diagnosis language and include a short safety note only when risk is high or symptoms are urgent. "
        "Avoid sounding robotic. Keep formatting simple plain text with short paragraphs or bullets when helpful.\n\n"
        f"Prediction context:\n"
        f"- Risk level: {risk_level}\n"
        f"- Probability: {probability}\n"
        f"- Risk factors: {', '.join(risk_factors) if risk_factors else 'None provided'}\n"
        f"- Patient data: {form_data}"
    )


def build_messages(user_message: str, history: list, context: dict) -> list:
    messages = [{"role": "system", "content": build_system_prompt(context)}]

    # Keep only recent turns and normalize roles to reduce prompt noise.
    for item in history[-12:]:
        role = item.get("role")
        content = item.get("content", "")
        if role in {"user", "assistant"} and content:
            messages.append({"role": role, "content": str(content)})

    # Avoid duplicate user turns when frontend includes the current message in history.
    if not messages or messages[-1].get("role") != "user" or messages[-1].get("content") != user_message:
        messages.append({"role": "user", "content": user_message})

    return messages


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", (value or "").strip().lower())


def mention(factors: list, keyword: str) -> bool:
    return any(keyword.lower() in str(item).lower() for item in (factors or []))


def contains_any(text: str, terms: list[str]) -> bool:
    return any(term in text for term in terms)


def build_action_plan(factors: list, form_data: dict) -> list:
    actions = []

    if mention(factors, "smoking") or form_data.get("smoking") == "Yes":
        actions.append("Quit smoking or reduce tobacco exposure with a structured quit plan.")
    if mention(factors, "alcohol") or form_data.get("alcoholDrinking") == "Yes":
        actions.append("Reduce heavy alcohol intake and keep drinking within safer limits.")
    if mention(factors, "physical") or form_data.get("physicalActivity") == "No":
        actions.append("Add regular physical activity, starting with consistent low-impact sessions.")
    if mention(factors, "bmi") or (form_data.get("bmi") and float(form_data.get("bmi", 0)) > 30):
        actions.append("Work on gradual weight reduction with a heart-healthy eating pattern.")
    if mention(factors, "diabetes") or form_data.get("diabetic") in {"Yes", "Yes (during pregnancy)"}:
        actions.append("Keep blood sugar controlled and follow your diabetes treatment plan closely.")
    if mention(factors, "kidney") or form_data.get("kidneyDisease") == "Yes":
        actions.append("Follow up on kidney health with regular monitoring and medication adherence.")
    if mention(factors, "walking") or form_data.get("diffWalking") == "Yes":
        actions.append("Discuss a safe mobility and exercise plan with a clinician or physiotherapist.")
    if form_data.get("genHealth") in {"Fair", "Poor"}:
        actions.append("Book a preventive checkup to review blood pressure, lipids, and glucose.")

    if not actions:
        actions.extend([
            "Keep exercising regularly and maintain healthy sleep.",
            "Continue preventive checkups and track key health markers.",
        ])

    return actions[:4]


def build_offline_reply(user_message: str, history: list, context: dict) -> str:
    normalized = normalize_text(user_message)
    risk_level = str(context.get("riskLevel", "Moderate"))
    probability = context.get("probability")
    factors = context.get("riskFactors") or []
    form_data = context.get("formData") or {}

    opening = ""
    if normalized.startswith(("hi", "hello", "hey")):
        opening = "Hi. "

    urgent_terms = ["chest pain", "shortness of breath", "fainting", "severe pain", "emergency"]
    if any(term in normalized for term in urgent_terms):
        return (
            f"{opening}Those symptoms can be urgent. Please seek immediate medical care now or call emergency services. "
            "I can still help explain your risk report after you are safe."
        )

    risk_summary = f"Your current result is {risk_level} risk"
    if probability is not None:
        risk_summary += f" with an estimated probability of {probability}%"
    risk_summary += "."

    if not factors or factors == ["No major risk factors detected"]:
        factor_line = "No major risk factors were flagged from your submitted data."
    else:
        factor_line = f"Main factors detected: {', '.join(factors[:4])}."

    # Identity and capability questions should be answered directly.
    if contains_any(normalized, ["which ai", "who are you", "what ai", "which model", "are you chatgpt"]):
        return (
            "I am the MediRisk AI Assistant. I use your submitted prediction context to explain risk factors "
            "and suggest practical prevention steps. If an external LLM is unavailable, I switch to an offline guidance mode."
        )

    # Topic-first educational responses (instead of generic repeated summaries).
    if "diabetes" in normalized:
        return (
            "Diabetes is strongly linked to heart disease because chronically high blood sugar can damage blood vessels "
            "and accelerate plaque buildup in arteries. It is also associated with inflammation, higher blood pressure, "
            "and adverse cholesterol patterns, which increase cardiovascular risk.\n\n"
            f"In your report: {risk_summary} {factor_line}"
        )

    if "smoking" in normalized:
        return (
            "Smoking increases heart disease risk by damaging artery walls, promoting plaque formation, reducing oxygen delivery, "
            "and increasing blood clot risk. Even reducing smoking helps, and quitting has major cardiovascular benefit over time.\n\n"
            f"In your report: {risk_summary} {factor_line}"
        )

    if contains_any(normalized, ["how is", "linked", "relation", "related to", "associated with"]):
        return (
            "Great question. Most cardiovascular risk factors are linked through a few common pathways: "
            "vessel damage, inflammation, metabolic stress, and reduced cardiopulmonary fitness. "
            "These pathways combine and raise long-term risk when multiple factors are present.\n\n"
            f"In your report: {risk_summary} {factor_line}"
        )

    # If user asks what to do, provide concrete plan.
    if any(term in normalized for term in ["what can i do", "how to", "reduce", "lower", "improve", "prevent", "next steps"]):
        actions = build_action_plan(factors, form_data)
        action_lines = "\n".join([f"- {item}" for item in actions])
        return (
            f"{opening}{risk_summary} {factor_line}\n"
            f"Practical next steps:\n{action_lines}\n"
            "These steps help reduce long-term cardiovascular risk, but they are not a diagnosis."
        )

    # If user asks why, explain drivers.
    if any(term in normalized for term in ["why", "reason", "cause", "how come", "explain"]):
        return (
            f"{opening}{risk_summary} {factor_line} "
            "This score comes from how multiple inputs combine in the model, not from a single test result. "
            "If you want, I can break down each factor one by one in plain language."
        )

    # Follow-up handling using previous turn.
    recent_user_turns = [m.get("content", "") for m in history if m.get("role") == "user"]
    previous_user = normalize_text(recent_user_turns[-1]) if recent_user_turns else ""
    if normalized in {"ok", "okay", "and?", "more", "tell me more", "next"}:
        actions = build_action_plan(factors, form_data)
        action_lines = "\n".join([f"- {item}" for item in actions])
        return (
            f"Sure. Based on your report, here is a focused plan:\n{action_lines}\n"
            "If you want, ask me for a 7-day starter routine and I will draft one."
        )

    if "diet" in normalized:
        return (
            f"{opening}{risk_summary} For diet, prioritize vegetables, whole grains, legumes, lean protein, "
            "less processed food, and lower salt/sugar. Aim for consistency over strict short-term changes."
        )

    if "exercise" in normalized or "workout" in normalized:
        return (
            f"{opening}{risk_summary} Start with moderate activity most days, such as brisk walking, "
            "and add strength work 2 days per week if medically safe."
        )

    if previous_user:
        return (
            f"{opening}{risk_summary} {factor_line} "
            "I can answer this in more detail. Ask specifically about one factor (for example Smoking or High BMI), "
            "and I will explain how it affects risk and what to do first."
        )

    return (
        f"{opening}{risk_summary} {factor_line} "
        "I can help with three things right now: why this score happened, what each factor means, and a practical plan to lower risk."
    )

@chat_bp.route("/message", methods=["POST"])
@require_auth
def chat():
    data = request.get_json(silent=True) or {}
    user_message = str(data.get("message", "")).strip()
    history = data.get("messages", []) or []
    context = data.get("context", {}) or {}

    if not user_message:
        return jsonify({"error": "Message cannot be empty."}), 400

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return jsonify({
            "reply": build_offline_reply(user_message, history, context),
            "model": "offline-assistant",
            "warning": "OPENAI_API_KEY not set; using offline assistant mode.",
        }), 200

    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    payload = {
        "model": model,
        "messages": build_messages(user_message, history, context),
        "temperature": 0.6,
        "presence_penalty": 0.1,
    }

    try:
        response = requests.post(
            f"{base_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=45,
        )

        if not response.ok:
            error_payload = response.json() if response.headers.get("content-type", "").startswith("application/json") else {}
            error_message = error_payload.get("error", {}).get("message") or response.text or "LLM request failed."
            return jsonify({"error": error_message}), 502

        result = response.json()
        reply = result["choices"][0]["message"]["content"].strip()
        return jsonify({"reply": reply, "model": model}), 200
    except requests.RequestException as exc:
        return jsonify({
            "reply": build_offline_reply(user_message, history, context),
            "model": "offline-assistant",
            "warning": f"LLM provider unreachable, switched to offline mode: {exc}",
        }), 200
    except (KeyError, IndexError, TypeError) as exc:
        return jsonify({
            "reply": build_offline_reply(user_message, history, context),
            "model": "offline-assistant",
            "warning": f"Unexpected LLM response format, switched to offline mode: {exc}",
        }), 200