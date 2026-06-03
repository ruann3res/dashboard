export type TokenDeliveryChannel = 'email' | 'whatsapp'

export interface AuthLoginRequest {
  email: string
  channel: TokenDeliveryChannel
}
