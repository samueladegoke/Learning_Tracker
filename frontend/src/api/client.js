const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`

  const config = {
    headers: {
      'Content-Type': 'application/json',
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
  submit: (data) => fetchAPI('/quizzes/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

