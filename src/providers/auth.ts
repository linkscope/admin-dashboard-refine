import type { AuthProvider } from '@refinedev/core'
import { API_URL, dataProvider } from './data'

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: 'post',
        meta: {
          variables: {
            email,
            password,
          },
          rawQuery: `
            mutation Login($email: String!) {
              login(loginInput: { email: $email }) {
                accessToken
              }
            }
          `,
        },
      })
      localStorage.setItem('access_token', data.login.accessToken)

      return { success: true, redirectTo: '/' }
    } catch (e: any) {
      return {
        success: false,
        error: {
          message: 'message' in e ? e.message : '登录失败',
          name: 'name' in e ? e.name : '邮箱或密码错误',
        },
      }
    }
  },
  logout: async () => {
    localStorage.removeItem('access_token')
    return {
      success: true,
      redirectTo: '/login',
    }
  },
  check: async () => {
    try {
      await dataProvider.custom({
        url: API_URL,
        method: 'post',
        meta: {
          rawQuery: `
            query Me {
              me {
                name
              }
            }
          `,
        },
      })
      return {
        authenticated: true,
      }
    } catch (e: any) {
      return {
        authenticated: false,
        redirectTo: '/login',
      }
    }
  },
  getIdentity: async () => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: 'post',
        meta: {
          rawQuery: `
            query Me {
              me {
                id
                name
                email
                phone
                jobTitle
                timezone
                avatarUrl
              }
            }
          `,
        },
      })

      return data.me
    } catch (e) {
      return undefined
    }
  },
  onError: async (error) => {
    if (error.statusCode === 'UNAUTHENTICATED') {
      return {
        logout: true,
        ...error,
      }
    }
    return { error }
  },
}
