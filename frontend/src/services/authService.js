const TOKEN_KEY = "medirisk_access_token";

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function authHeaders(extra = {}) {
  const token = getAccessToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}