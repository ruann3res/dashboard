import axios from 'axios'
import { cookieUtils } from '@/lib/cookies'
import { getRoleFromToken } from '@/lib/jwt'

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

    // #region agent log
    const url = config.url ?? ''
    if (url.includes('/projects') || url.includes('/users')) {
      const jwtRole = token ? getRoleFromToken(token) : null
      fetch('http://127.0.0.1:7876/ingest/14ee2907-5f72-442c-bc8a-084a5c3b6917',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4ee2cf'},body:JSON.stringify({sessionId:'4ee2cf',location:'http.ts:request',message:'API request',data:{method:config.method,url,hasToken:!!token,jwtRole,registerRole:config.method==='post'&&url.includes('/users')?(config.data as {role?:string})?.role:null},timestamp:Date.now(),hypothesisId:'H1-H3'})}).catch(()=>{});
    }
    // #endregion

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // #region agent log
    if (error.response?.status === 403) {
      const token = cookieUtils.getToken()
      fetch('http://127.0.0.1:7876/ingest/14ee2907-5f72-442c-bc8a-084a5c3b6917',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4ee2cf'},body:JSON.stringify({sessionId:'4ee2cf',location:'http.ts:response403',message:'403 forbidden',data:{url:error.config?.url,status:403,jwtRole:token?getRoleFromToken(token):null,apiDetails:error.response?.data?.details??null,apiError:error.response?.data?.error??null},timestamp:Date.now(),hypothesisId:'H1-H4'})}).catch(()=>{});
    }
    // #endregion

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
