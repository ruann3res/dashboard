import axios from 'axios'
import { cookieUtils } from '@/lib/cookies'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(
  (config) => {
    const token = cookieUtils.getToken()
    if (token) {
      const authHeader = `Bearer ${token}`
      config.headers.Authorization = authHeader
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      const isAuthPage = currentPath === '/login' || currentPath === '/register'
      
      if (!isAuthPage) {
        cookieUtils.removeToken()
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      }
    }
    
    return Promise.reject(error)
  }
)

export default http
