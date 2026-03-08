import axios from 'axios'

/**
 * Configured Axios instance for the Job Tracker API.
 * The Vite dev server proxy forwards /api/* to http://localhost:8080.
 */
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Response interceptor — unwrap data, log errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred'
    console.error('[API Error]', message, error.response?.data)
    return Promise.reject(new Error(message))
  }
)

// ─── Job Applications ───────────────────────────────────────────────────────

export const jobsApi = {
  /** Create a new job application */
  create: (data) => api.post('/jobs', data),

  /** Fetch paginated, filtered job applications */
  getAll: (params = {}) => api.get('/jobs', { params }),

  /** Fetch a single job application by ID */
  getById: (id) => api.get(`/jobs/${id}`),

  /** Update an existing job application */
  update: (id, data) => api.put(`/jobs/${id}`, data),

  /** Delete a job application */
  delete: (id) => api.delete(`/jobs/${id}`),

  /** Fetch dashboard summary stats */
  getStats: () => api.get('/jobs/dashboard/stats'),

  /** Fetch 5 most recent applications */
  getRecent: () => api.get('/jobs/dashboard/recent'),
}

export default api
