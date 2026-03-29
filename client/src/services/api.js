import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('hp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hp_token');
      localStorage.removeItem('hp_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

// Hospital API
export const hospitalAPI = {
  getAll: (params) => API.get('/hospitals', { params }),
  getOne: (id) => API.get(`/hospitals/${id}`),
  getDoctors: (id) => API.get(`/hospitals/${id}/doctors`),
  create: (data) => API.post('/hospitals', data),
  update: (id, data) => API.put(`/hospitals/${id}`, data),
  delete: (id) => API.delete(`/hospitals/${id}`),
};

// Department API
export const departmentAPI = {
  getAll: () => API.get('/departments'),
  create: (data) => API.post('/departments', data),
  update: (id, data) => API.put(`/departments/${id}`, data),
  delete: (id) => API.delete(`/departments/${id}`),
};

// Appointment API
export const appointmentAPI = {
  book: (data) => API.post('/appointments', data),
  getMine: (params) => API.get('/appointments/me', { params }),
  getDoctorAppointments: (params) => API.get('/appointments/doctor', { params }),
  getAll: (params) => API.get('/appointments', { params }),
  cancel: (id) => API.patch(`/appointments/${id}/cancel`),
  complete: (id) => API.patch(`/appointments/${id}/complete`),
};

// Availability API
export const availabilityAPI = {
  set: (data) => API.post('/availability', data),
  getSchedule: () => API.get('/availability/schedule'),
  getSlots: (doctorId, date) => API.get(`/availability/${doctorId}/slots`, { params: { date } }),
};

// Image API
export const imageAPI = {
  upload: (formData) => API.post('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: (params) => API.get('/images', { params }),
};

export default API;
