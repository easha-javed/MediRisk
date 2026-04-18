from flask import Blueprint, request, jsonify
from models.user import create_user, get_user_by_email, verify_password
from security import create_access_token
from validation import validate_auth_payload

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    try:
        validate_auth_payload(data, mode="register")
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    name     = data.get("name", "").strip()
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    try:
        user = create_user(name, email, password)
        token = create_access_token(user)
        return jsonify({"message": "User registered successfully.", "user": user, "accessToken": token}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 409

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    try:
        validate_auth_payload(data, mode="login")
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = get_user_by_email(email)
    if not user:
        return jsonify({"error": "Invalid email or password."}), 401
    if not verify_password(password, user["password"]):
        return jsonify({"error": "Invalid email or password."}), 401

    public_user = {"uid": user["uid"], "name": user["name"], "email": user["email"]}
    token = create_access_token(public_user)
    return jsonify({"message": "Login successful.", "user": public_user, "accessToken": token}), 200