import base64
import hashlib
import hmac
import json
import os
import time
from functools import wraps

from flask import g, jsonify, request


JWT_SECRET = os.getenv("JWT_SECRET", "change-me-in-production")
JWT_ALG = "HS256"
JWT_TTL_SECONDS = int(os.getenv("JWT_TTL_SECONDS", "7200"))


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _b64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def _sign(data: str) -> str:
    signature = hmac.new(JWT_SECRET.encode("utf-8"), data.encode("utf-8"), hashlib.sha256).digest()
    return _b64url_encode(signature)


def create_access_token(user: dict) -> str:
    header = {"alg": JWT_ALG, "typ": "JWT"}
    now = int(time.time())
    payload = {
        "sub": user.get("uid"),
        "email": user.get("email"),
        "name": user.get("name"),
        "iat": now,
        "exp": now + JWT_TTL_SECONDS,
    }

    header_b64 = _b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_b64 = _b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_b64}.{payload_b64}"
    signature = _sign(signing_input)
    return f"{signing_input}.{signature}"


def decode_access_token(token: str) -> dict:
    parts = token.split(".")
    if len(parts) != 3:
        raise ValueError("Invalid token format")

    header_b64, payload_b64, signature = parts
    signing_input = f"{header_b64}.{payload_b64}"
    expected_signature = _sign(signing_input)

    if not hmac.compare_digest(signature, expected_signature):
        raise ValueError("Invalid token signature")

    payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
    exp = int(payload.get("exp", 0))
    if exp < int(time.time()):
        raise ValueError("Token expired")

    return payload


def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header."}), 401

        token = auth_header.split(" ", 1)[1].strip()
        try:
            payload = decode_access_token(token)
            g.current_user = payload
        except ValueError as exc:
            return jsonify({"error": f"Unauthorized: {exc}"}), 401

        return fn(*args, **kwargs)

    return wrapper