const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || 'Unable to sign in.');
  return payload;
}

async function profileRequest(path, username, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'x-demo-user': username, ...options.headers },
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.errors?.[0] || payload.message || 'Unable to save your profile.');
  return payload;
}

export function getProfile(username) { return profileRequest('/profiles/me', username); }
export function saveProfile(username, profile) { return profileRequest('/profiles/me', username, { method: 'PUT', body: JSON.stringify(profile) }); }
export function acknowledgeDisclaimer(username) { return profileRequest('/profiles/disclaimer-acknowledgement', username, { method: 'POST' }); }
export function generateMealPlan(username) { return profileRequest('/meal-plans/generate', username, { method: 'POST' }); }
export function getTodayMealPlan(username) { return profileRequest('/meal-plans/today', username); }
export function getGroceryList(username, mealPlanId) { return profileRequest(`/meal-plans/${mealPlanId}/grocery-list`, username); }
export async function getStoreLinks(item) { const response = await fetch(`${API_BASE_URL}/grocery-links?item=${encodeURIComponent(item)}`); const payload = await response.json(); if (!response.ok) throw new Error(payload.message || 'Unable to get store links.'); return payload; }
export function getDashboard(username) { return profileRequest('/dashboard/today', username); }
export function saveMealLog(username, payload) { return profileRequest('/meal-logs', username, { method: 'POST', body: JSON.stringify(payload) }); }
export function addWater(username, amountMl) { return profileRequest('/water-logs/entries', username, { method: 'POST', body: JSON.stringify({ amountMl }) }); }
export function removeWater(username) { return profileRequest('/water-logs/entries', username, { method: 'DELETE' }); }
export function generateWeeklyPlan(username, startDate) { return profileRequest('/weekly-plans/generate', username, { method: 'POST', body: JSON.stringify({ startDate }) }); }
