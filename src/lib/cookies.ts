import Cookies from 'js-cookie'

const TOKEN_KEY = 'auth_token'

export const cookieUtils = {
  getToken: (): string | undefined => {
    const token = Cookies.get(TOKEN_KEY)
    return token
  },

  setToken: (token: string): void => {
    Cookies.set(TOKEN_KEY, token, {
      expires: 7,
      sameSite: 'lax',
      secure: import.meta.env.PROD,
      path: '/',
    })
  },

  removeToken: (): void => {
    Cookies.remove(TOKEN_KEY, { path: '/' })
  },

  hasToken: (): boolean => {
    return !!Cookies.get(TOKEN_KEY)
  },
}

