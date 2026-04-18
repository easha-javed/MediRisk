from datetime import datetime

from config import db


USERS_COLLECTION = "users"
HISTORY_SUBCOLLECTION = "prediction_history"


def add_history_record(user_id: str, record: dict) -> dict:
    payload = {
        "riskLevel": record.get("riskLevel"),
        "probability": record.get("probability"),
        "riskFactors": record.get("riskFactors") or [],
        "formData": record.get("formData") or {},
        "createdAt": datetime.utcnow().isoformat(),
    }

    ref = (
        db.collection(USERS_COLLECTION)
        .document(user_id)
        .collection(HISTORY_SUBCOLLECTION)
        .document()
    )
    ref.set(payload)

    payload["id"] = ref.id
    return payload


def list_history_records(user_id: str, limit: int = 50):
    query = (
        db.collection(USERS_COLLECTION)
        .document(user_id)
        .collection(HISTORY_SUBCOLLECTION)
        .order_by("createdAt", direction="DESCENDING")
        .limit(limit)
    )

    docs = query.get()
    items = []
    for doc in docs:
        item = doc.to_dict()
        item["id"] = doc.id
        items.append(item)
    return items


def clear_history_records(user_id: str) -> int:
    collection_ref = (
        db.collection(USERS_COLLECTION)
        .document(user_id)
        .collection(HISTORY_SUBCOLLECTION)
    )

    docs = list(collection_ref.stream())
    for doc in docs:
        doc.reference.delete()
    return len(docs)