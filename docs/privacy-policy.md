# Privacy Policy (Prototype)

## Scope
This policy applies to the MediRisk prototype application used for educational and development purposes.

## Data Collected
- Account data: name, email, hashed password
- Prediction input data submitted by users
- Local browser prediction history (stored on-device)

## Data Usage
- To authenticate users
- To run risk prediction and explanation features
- To improve product quality and safety

## Storage
- Authentication data is stored in Firebase Firestore.
- Prediction history is currently stored in browser local storage for prototype use.

## Security
- Password hashing is applied before persistence.
- Secrets should be stored in environment variables and never committed.

## User Rights (Prototype Guidance)
- Users can request account and data deletion through project administrators.
- Users can clear local history directly from the history page.

## Medical Disclaimer
MediRisk is not a medical diagnosis tool. In emergencies, contact local emergency services immediately.