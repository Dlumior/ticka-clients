export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  date_joined: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
}
