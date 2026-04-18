const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import { authHeaders } from "./authService";

export async function sendChatMessage({ message, messages = [], context = {} }) {
	const response = await fetch(`${API_URL}/api/chat/message`, {
		method: 'POST',
		headers: authHeaders({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({ message, messages, context }),
	});

	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(data.error || 'Chat request failed. Please try again.');
	}

	return data;
}

export async function fetchHistory() {
	const response = await fetch(`${API_URL}/api/history`, {
		method: 'GET',
		headers: authHeaders(),
	});

	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		throw new Error(data.error || 'Failed to fetch history.');
	}

	return data.items || [];
}

export async function createHistoryItem(payload) {
	const response = await fetch(`${API_URL}/api/history`, {
		method: 'POST',
		headers: authHeaders({ 'Content-Type': 'application/json' }),
		body: JSON.stringify(payload),
	});

	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		throw new Error(data.error || 'Failed to save history.');
	}

	return data.item;
}

export async function deleteHistoryItems() {
	const response = await fetch(`${API_URL}/api/history`, {
		method: 'DELETE',
		headers: authHeaders(),
	});

	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		throw new Error(data.error || 'Failed to clear history.');
	}

	return data.deleted || 0;
}

export { API_URL };
