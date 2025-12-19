import { supabase } from '../lib/supabase'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

let cachedSession = null;
let lastSessionFetch = 0;
const SESSION_CACHE_TTL = 30000; // 30 seconds

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`

  // Get current session for auth token with 30s caching
  const now = Date.now();
  if (!cachedSession || (now - lastSessionFetch > SESSION_CACHE_TTL)) {
    const { data: { session } } = await supabase.auth.getSession()
    cachedSession = session;
    lastSessionFetch = now;
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(cachedSession?.access_token && { 'Authorization': `Bearer ${cachedSession.access_token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `HTTP ${response.status}`)
  }

  return response.json()
}

// Clear cached session (call on logout to prevent stale token usage)
export function clearSessionCache() {
  cachedSession = null;
  lastSessionFetch = 0;
}

// Weeks API
export const weeksAPI = {
  getAll: () => fetchAPI('/weeks'),
  getById: (id) => fetchAPI(`/weeks/${id}`),
  getByNumber: (weekNumber) => fetchAPI(`/weeks/number/${weekNumber}`),
}

// Tasks API
export const tasksAPI = {
  get: (taskId) => fetchAPI(`/tasks/${taskId}`),
  complete: (taskId) => fetchAPI(`/tasks/${taskId}/complete`, { method: 'POST' }),
  uncomplete: (taskId) => fetchAPI(`/tasks/${taskId}/uncomplete`, { method: 'POST' }),
}

// Reflections API
export const reflectionsAPI = {
  getAll: () => fetchAPI('/reflections'),
  getForWeek: (weekId) => fetchAPI(`/reflections/week/${weekId}`),
  create: (data) => fetchAPI('/reflections', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// Progress API
export const progressAPI = {
  get: () => fetchAPI('/progress'),
  getCalendar: () => fetchAPI('/progress/calendar'),
}

// Badges API
export const badgesAPI = {
  getAll: () => fetchAPI('/badges'),
}

// Achievements API
export const achievementsAPI = {
  getAll: () => fetchAPI('/achievements'),
}

// RPG API
export const rpgAPI = {
  getState: () => fetchAPI('/rpg/state'),
  buyItem: (itemId) => fetchAPI(`/rpg/buy/${itemId}`, { method: 'POST' }),
  awardXP: (amount) => fetchAPI(`/rpg/award-xp?amount=${amount}`, { method: 'POST' }),
}

// Quizzes API
export const quizzesAPI = {
  getQuestions: (quizId) => fetchAPI(`/quizzes/${quizId}/questions`),
  getCompleted: () => fetchAPI('/quizzes/completed'),
  getLeaderboard: (limit = 20) => fetchAPI(`/quizzes/leaderboard?limit=${limit}`),
  submit: (data) => fetchAPI('/quizzes/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// Spaced Repetition System (SRS) API
export const srsAPI = {
  getDailyReview: () => fetchAPI('/srs/daily-review'),
  submitResult: (data) => fetchAPI('/srs/review-result', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  addToReview: (questionId) => fetchAPI(`/srs/add-to-review/${questionId}`, { method: 'POST' }),
  getStats: () => fetchAPI('/srs/stats'),
}

