import { createHistoryItem, deleteHistoryItems, fetchHistory } from "./api";

export async function getPredictionHistory() {
  return fetchHistory();
}

export async function savePredictionRecord(record) {
  return createHistoryItem(record);
}

export async function clearPredictionHistory() {
  return deleteHistoryItems();
}