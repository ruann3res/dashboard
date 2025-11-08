export interface CreateUserRequest {
    name: string
    email: string
    phone: string
    role: 'scientist' | 'enthusiast'
  }
  
export interface CreateUserResponse {
    success: boolean
    message: string
    data?: {
      token?: string
      userId?: string
    }
  } 