from flask import Blueprint, request, jsonify
from models.user import create_user, get_user_by_email, verify_password

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name     = data.get("name", "").strip()
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not name or not email or not password:
        return jsonify({"error": "All fields are required."}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400
    try:
        user = create_user(name, email, password)
        return jsonify({"message": "User registered successfully.", "user": user}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 409

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400
    user = get_user_by_email(email)
    if not user:
        return jsonify({"error": "Invalid email or password."}), 401
    if not verify_password(password, user["password"]):
        return jsonify({"error": "Invalid email or password."}), 401
    return jsonify({"message": "Login successful.", "user": {"uid": user["uid"], "name": user["name"], "email": user["email"]}}), 200