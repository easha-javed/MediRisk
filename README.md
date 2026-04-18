# MediRisk - AI-Powered Cardiovascular Risk Prediction System

![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Flask](https://img.shields.io/badge/Flask-Python-green?style=flat-square&logo=flask)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat-square&logo=firebase)
![License](https://img.shields.io/badge/License-Academic-lightgrey?style=flat-square)

## Description

MediRisk is an AI-assisted web application for estimating cardiovascular risk from user health inputs.
The platform combines:

- A trained machine learning model for probability + risk level classification
- Clinical-style explanation blocks for result interpretation
- A chat assistant connected to an OpenAI-compatible endpoint with offline fallback behavior
- Firebase-backed history tracking per authenticated user

## Team Members

- Easha Javed
- Dania Athar

## Current Capabilities

- User registration and login
- JWT-based API authentication
- Protected prediction, chat, and history routes
- Heart disease risk prediction (Low / Moderate / High)
- Probability score and risk factor extraction
- AI explanation panel in the result page
- Chat drawer with contextual assistant responses
- Firebase-backed prediction history (list, create, clear)
- Downloadable text report from result page
- Clinical safety disclaimer components

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, React Router, custom CSS |
| Backend | Python 3, Flask, Flask-CORS |
| Database | Firebase Firestore |
| Authentication | bcrypt password hashing + custom JWT |
| ML Model | scikit-learn + imbalanced-learn + joblib |
| LLM Integration | OpenAI-compatible Chat Completions API |

## Project Structure

```text
MediRisk/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── security.py
│   ├── validation.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── prediction.py
│   │   ├── chat.py
│   │   └── history.py
│   ├── models/
│   │   ├── predict.py
│   │   ├── train.py
│   │   ├── user.py
│   │   ├── history.py
│   │   ├── data/
│   │   └── saved_model/
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
├── docs/
│   ├── api-docs.md
│   ├── model-card.md
│   └── privacy-policy.md
├── .github/workflows/ci.yml
└── README.md
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- Firebase project with Firestore enabled
- Firebase service account key JSON file

## Environment Setup

1. Copy `.env.example` to `.env` (project root) or `backend/.env`.
2. Fill required variables:

```env
FIREBASE_CONFIG_PATH=firebase_config.json
FLASK_ENV=development
FLASK_PORT=5000
OPENAI_API_KEY=
OPENAI_MODEL=meta/llama-3.1-70b-instruct
OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1
JWT_SECRET=replace-this-secret
JWT_TTL_SECONDS=7200
```

3. Place Firebase service account key at `backend/firebase_config.json`.

Note:

- If `OPENAI_API_KEY` is empty, chat automatically uses offline assistant mode.
- `.env` and Firebase key files are excluded from git.

## Run Locally

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

Backend URL: `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user and issue access token |
| POST | `/api/auth/login` | No | Login and issue access token |
| POST | `/api/prediction/predict` | Yes | Run risk prediction |
| POST | `/api/chat/message` | Yes | Chat with contextual assistant |
| GET | `/api/history` | Yes | List user prediction history |
| POST | `/api/history` | Yes | Save prediction record |
| DELETE | `/api/history` | Yes | Clear user history |

Full API reference: `docs/api-docs.md`

## Validation and Quality Checks

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

### Backend

```bash
cd backend
python -m pytest -q
```

If `pytest` is missing in your current Python runtime, install it with:

```bash
pip install pytest
```

CI workflow file: `.github/workflows/ci.yml`

## Security Notes

- Passwords are hashed with bcrypt before storage.
- JWT protects prediction/chat/history APIs.
- Never commit `.env` or Firebase credential JSON.
- Replace `JWT_SECRET` with a strong secret in production.

## Governance and Documentation

- API docs: `docs/api-docs.md`
- Model card: `docs/model-card.md`
- Privacy policy: `docs/privacy-policy.md`

## Project Status

| Feature | Status |
|---------|--------|
| Frontend app pages and routing | Implemented |
| Flask REST API | Implemented |
| Firebase Firestore integration | Implemented |
| JWT auth and protected routes | Implemented |
| ML cardiovascular risk model inference | Implemented |
| AI chat assistant integration | Implemented |
| Offline chat fallback mode | Implemented |
| Prediction history (Firebase-backed) | Implemented |
| Downloadable report | Implemented |
| CI pipeline and backend tests | Implemented |

