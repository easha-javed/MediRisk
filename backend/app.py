import os
from pathlib import Path

from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.history import history_bp
from routes.prediction import prediction_bp
from routes.chat import chat_bp


def load_env_file() -> None:
    for env_path in (
        Path(__file__).resolve().parent / ".env",
        Path(__file__).resolve().parent.parent / ".env",
    ):
        if not env_path.exists():
            continue

        for line in env_path.read_text(encoding="utf-8").splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith("#") or "=" not in stripped:
                continue

            key, value = stripped.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env_file()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(history_bp, url_prefix="/api/history")
app.register_blueprint(prediction_bp, url_prefix="/api/prediction")
app.register_blueprint(chat_bp, url_prefix="/api/chat")

if __name__ == "__main__":
    app.run(debug=True, port=5000)