from flask import Blueprint, request, jsonify
from models.predict import predict   # 👈 USE THIS
from security import require_auth
from validation import validate_prediction_payload

prediction_bp = Blueprint("prediction", __name__)

@prediction_bp.route("/predict", methods=["POST"])
@require_auth
def predict_route():
    try:
        data = request.get_json(silent=True) or {}
        validate_prediction_payload(data)

        result = predict(data)   # 👈 THIS HANDLES EVERYTHING

        return jsonify(result), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500