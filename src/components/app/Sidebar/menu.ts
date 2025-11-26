export interface MenuItem {
  label: string
  path: string
}

export const menuItems: Array<MenuItem> = [
  { label: 'Projetos', path: '/' },
  { label: 'Dispositivos', path: '/devices' },
  { label: 'Atuadores', path: '/actuators' },
  { label: 'Configurações', path: '/settings' },
  
  
]