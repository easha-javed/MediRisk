const API_URL = 'http://localhost:5000';
import { authHeaders } from "./authService";

function mapFormDataToAPI(formData) {
  const ageMap = {
    '18-24': '18-24', '25-29': '25-29', '30-34': '30-34',
    '35-39': '35-39', '40-44': '40-44', '45-49': '45-49',
    '50-54': '50-54', '55-59': '55-59', '60-64': '60-64',
    '65-69': '65-69', '70-74': '70-74', '75-79': '75-79',
    '80+': '80 or older'
  };

  return {
    BMI:              parseFloat(formData.bmi),
    Smoking:          formData.smoking,
    AlcoholDrinking:  formData.alcoholDrinking,
    Stroke:           formData.stroke,
    PhysicalHealth:   parseFloat(formData.physicalHealth),
    MentalHealth:     parseFloat(formData.mentalHealth),
    DiffWalking:      formData.diffWalking,
    Sex:              formData.sex,
    AgeCategory:      ageMap[formData.ageCategory] || formData.ageCategory,
    Race:             formData.race,
    Diabetic:         formData.diabetic,
    PhysicalActivity: formData.physicalActivity,
    GenHealth:        formData.genHealth,
    SleepTime:        parseFloat(formData.sleepTime),
    Asthma:           formData.asthma,
    KidneyDisease:    formData.kidneyDisease,
    SkinCancer:       formData.skinCancer,
  };
}

export async function predictHeartDisease(formData) {
  const payload = mapFormDataToAPI(formData);

  const response = await fetch(`${API_URL}/api/prediction/predict`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Prediction failed. Please try again.');
  }

  return {
    riskLevel: data.riskLevel ?? data.risk_level,
    probability: data.probability,
    riskFactors: data.riskFactors ?? data.risk_factors ?? [],
    modelAccuracy: data.modelAccuracy ?? data.model_accuracy,
  };
}

export async function checkAPIHealth() {
  try {
    const res = await fetch(`${API_URL}/health`);
    const data = await res.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}
