import api from './api'

export const loginUser = async (credentials) => api.post('/auth/login', credentials)

export const registerUser = async (userData) => api.post('/auth/register', userData)
