from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.prediction import prediction_bp
from routes.chat import chat_bp

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(prediction_bp, url_prefix="/api/prediction")
app.register_blueprint(chat_bp, url_prefix="/api/chat")

if __name__ == "__main__":
    app.run(debug=True, port=5000)