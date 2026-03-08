import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getProfile: () =>
    api.get('/auth/me'),
  updateProfile: (data) =>
    api.put('/auth/profile', data),
}

// Project API
export const projectAPI = {
  upload: (formData) =>
    api.post('/projects/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMyProjects: () =>
    api.get('/projects/my-projects'),
  getProjectById: (id) =>
    api.get(`/projects/${id}`),
  updateStatus: (id, status) =>
    api.put(`/projects/${id}/status`, { status }),
  deleteProject: (id) =>
    api.delete(`/projects/${id}`),
  getStats: () =>
    api.get('/projects/stats'),
}

// Verification API
export const verificationAPI = {
  // submit a review for a specific project (protected)
  submitVerification: (projectId, reviewData) =>
    api.post(`/verify/${projectId}`, reviewData),

  // get all verifications for a project
  getProjectVerifications: (projectId) =>
    api.get(`/verify/${projectId}`),

  // verify a project hash on blockchain
  verifyHash: (hash) =>
    api.post(`/verify/hash/${hash}`, {}),

  // reviewer-specific stats (requires auth)
  getReviewerStats: () =>
    api.get('/verify/stats/reviewer'),

  // overall verification stats
  getStats: () =>
    api.get('/verify/stats/all'),

  // projects available for the current user to review
  getAvailableProjects: () =>
    api.get('/verify/available'),
}

export default api
