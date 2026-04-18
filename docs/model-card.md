# Model Card: MediRisk Cardiovascular Predictor

## Intended Use
- Educational and risk-screening support for adult cardiovascular risk awareness.
- Not intended for diagnosis, emergency triage, or autonomous clinical decisions.

## Inputs
- Structured self-reported health indicators (BMI, smoking, alcohol use, mobility, diabetes, etc.).

## Outputs
- Risk level: Low / Moderate / High
- Probability estimate (percentage)
- Top detected risk factors

## Known Limitations
- Relies on self-reported data quality.
- Performance may vary across population subgroups.
- Does not replace clinician assessment, labs, imaging, or medical history review.

## Safety Controls
- UI-level disclaimer and urgent symptom escalation notice.
- Chat assistant includes emergency escalation messaging.

## Monitoring Recommendations
- Recalculate model metrics each release.
- Track calibration drift and subgroup performance.
- Keep a documented retraining and validation process.