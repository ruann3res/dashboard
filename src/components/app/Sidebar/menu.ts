import type { UserRole } from '@/lib/jwt'

export interface MenuItem {
  label: string
  path: string
  roles?: UserRole[]
}

export const menuItems: Array<MenuItem> = [
  { label: 'Projetos', path: '/', roles: ['scientist'] },
  { label: 'Dispositivos', path: '/devices', roles: ['scientist'] },
  { label: 'Atuadores', path: '/actuators', roles: ['scientist'] },
  { label: 'Monitoramento', path: '/monitor' },
  { label: 'Configurações', path: '/settings', roles: ['scientist'] },
]

export const getMenuItemsForRole = (role: UserRole): MenuItem[] => {
  return menuItems.filter((item) => !item.roles || item.roles.includes(role))
}
