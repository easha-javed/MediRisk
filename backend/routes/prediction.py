from flask import Blueprint, request, jsonify

prediction_bp = Blueprint("prediction", __name__)

@prediction_bp.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    return jsonify({"message": "Prediction endpoint ready.", "received_data": data, "risk_score": None}), 200