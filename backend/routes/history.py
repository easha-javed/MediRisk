from flask import Blueprint, g, request, jsonify

from models.history import add_history_record, clear_history_records, list_history_records
from security import require_auth


history_bp = Blueprint("history", __name__)


@history_bp.route("", methods=["GET"])
@require_auth
def get_history():
    user_id = g.current_user.get("sub")
    items = list_history_records(user_id, limit=50)
    return jsonify({"items": items}), 200


@history_bp.route("", methods=["POST"])
@require_auth
def create_history_record():
    data = request.get_json(silent=True) or {}

    if not isinstance(data, dict):
        return jsonify({"error": "JSON object payload is required."}), 400

    required = ["riskLevel", "probability", "riskFactors", "formData"]
    missing = [field for field in required if field not in data]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    user_id = g.current_user.get("sub")
    item = add_history_record(user_id, data)
    return jsonify({"item": item}), 201


@history_bp.route("", methods=["DELETE"])
@require_auth
def delete_history():
    user_id = g.current_user.get("sub")
    deleted = clear_history_records(user_id)
    return jsonify({"deleted": deleted}), 200