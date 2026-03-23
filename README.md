# MediRisk — AI-Powered Cardiovascular Risk Prediction System

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Flask](https://img.shields.io/badge/Flask-Python-green?style=flat-square&logo=flask)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat-square&logo=firebase)
![License](https://img.shields.io/badge/License-Academic-lightgrey?style=flat-square)

## Description

MediRisk is an AI-powered web application designed to assess cardiovascular disease risk based on patient-provided health parameters. The system combines a machine learning prediction model with an explainable AI interface, delivering not only a quantified risk score but also a human-readable breakdown of the contributing factors.

---

## Team Members
Easha Javed
Dania Athar
---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Python 3, Flask |
| Database | Firebase Firestore (NoSQL) |
| Authentication | bcrypt password hashing |
| ML Model | Scikit-learn (Iteration 2) |
| HTTP Client | Axios |

---

## Folder Structure
```
MediRisk/
├── backend/
│   ├── routes/
│   │   ├── auth.py
│   │   ├── prediction.py
│   │   └── chat.py
│   ├── models/
│   │   └── user.py
│   ├── app.py
│   ├── config.py
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
├── database/
│   ├── schema.sql
│   └── seed.sql
├── docs/
│   ├── report.docx
│   └── api-docs.md
└── README.md
```

---

## Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- A Firebase project with Firestore enabled
- Firebase service account key file 

---

## How to Run

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

The Flask server will start at `http://localhost:5000`.

Place your Firebase service account key at `backend/firebase_config.json` before running.
This file is excluded from version control. Refer to `.env.example` for configuration reference.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The Vite development server will start at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate an existing user |
| POST | `/api/prediction/predict` | Submit health data for risk prediction |
| POST | `/api/chat/message` | Send a message to the AI assistant |

Full endpoint documentation is available in `docs/api-docs.md`.

---

## Security

- All passwords are hashed using bcrypt before being stored in Firestore.
- Firebase credentials (`firebase_config.json`) are excluded from version control via `.gitignore`.
- The `.env.example` file provides a safe template for environment configuration. Never commit `.env` or `firebase_config.json` to any repository.

---

## Project Status

| Feature | Status |
|---------|--------|
| Frontend UI — 6 pages | Complete |
| Flask REST API | Complete |
| Firebase Firestore integration | Complete |
| User registration and login | Complete |
| ML cardiovascular risk model | Planned — Iteration 2 |
| AI chat assistant | Planned — Iteration 2 |

---

## Course Information

**Course:** Fundamentals of Software Engineering
**Institution:** FAST-NUCES, Lahore
**Semester:** Spring 2026

---
