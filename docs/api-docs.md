# MediRisk API Documentation

Base URL: `http://localhost:5000`

## Authentication

### Register
- `POST /api/auth/register`

Request:
```json
{
	"name": "Sarah Khan",
	"email": "sarah@email.com",
	"password": "strong-pass-123"
}
```

Response:
```json
{
	"message": "User registered successfully.",
	"user": {
		"uid": "...",
		"name": "Sarah Khan",
		"email": "sarah@email.com"
	},
	"accessToken": "<jwt>"
}
```

### Login
- `POST /api/auth/login`

Request:
```json
{
	"email": "sarah@email.com",
	"password": "strong-pass-123"
}
```

Response:
```json
{
	"message": "Login successful.",
	"user": {
		"uid": "...",
		"name": "Sarah Khan",
		"email": "sarah@email.com"
	},
	"accessToken": "<jwt>"
}
```

## Prediction

### Predict heart disease risk
- `POST /api/prediction/predict`
- Requires header: `Authorization: Bearer <jwt>`

Request (example):
```json
{
	"BMI": 31.2,
	"Smoking": "Yes",
	"AlcoholDrinking": "No",
	"Stroke": "No",
	"PhysicalHealth": 4,
	"MentalHealth": 5,
	"DiffWalking": "No",
	"Sex": "Male",
	"AgeCategory": "55-59",
	"Race": "White",
	"Diabetic": "No",
	"PhysicalActivity": "Yes",
	"GenHealth": "Good",
	"SleepTime": 7,
	"Asthma": "No",
	"KidneyDisease": "No",
	"SkinCancer": "No"
}
```

Response:
```json
{
	"riskLevel": "Moderate",
	"probability": 58.9,
	"riskFactors": ["Smoking", "High BMI"],
	"modelAccuracy": 0.8896
}
```

## Chat Assistant

### Send chat message
- `POST /api/chat/message`
- Requires header: `Authorization: Bearer <jwt>`

Request:
```json
{
	"message": "How can I reduce my risk?",
	"messages": [],
	"context": {
		"riskLevel": "Moderate",
		"probability": 58.9,
		"riskFactors": ["Smoking", "High BMI"],
		"formData": {}
	}
}
```

Response:
```json
{
	"reply": "...",
	"model": "..."
}
```

## Firebase-backed Prediction History

### List history
- `GET /api/history`
- Requires header: `Authorization: Bearer <jwt>`

Response:
```json
{
	"items": [
		{
			"id": "...",
			"createdAt": "2026-04-18T12:30:00.000000",
			"riskLevel": "Moderate",
			"probability": 58.9,
			"riskFactors": ["Smoking"],
			"formData": {}
		}
	]
}
```

### Create history record
- `POST /api/history`
- Requires header: `Authorization: Bearer <jwt>`

### Clear history
- `DELETE /api/history`
- Requires header: `Authorization: Bearer <jwt>`

## Error format
```json
{
	"error": "Descriptive message"
}
```

