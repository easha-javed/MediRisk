from config import db
import bcrypt
from datetime import datetime

USERS_COLLECTION = "users"

def create_user(name: str, email: str, password: str) -> dict:
    existing = db.collection(USERS_COLLECTION).where("email", "==", email).get()
    if len(existing) > 0:
        raise ValueError("Email already registered.")
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user_data = {
        "name": name,
        "email": email,
        "password": hashed_pw,
        "created_at": datetime.utcnow().isoformat()
    }
    doc_ref = db.collection(USERS_COLLECTION).document()
    doc_ref.set(user_data)
    return {"uid": doc_ref.id, "name": name, "email": email}

def get_user_by_email(email: str):
    docs = db.collection(USERS_COLLECTION).where("email", "==", email).get()
    if not docs:
        return None
    doc = docs[0]
    data = doc.to_dict()
    data["uid"] = doc.id
    return data

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))