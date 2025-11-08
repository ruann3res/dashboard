export interface MenuItem {
  label: string
  path: string
}

export const menuItems: Array<MenuItem> = [
  { label: 'Projects', path: '/' },
  { label: 'Devices', path: '/devices' },
  { label: 'Actuators', path: '/actuators' },
  { label: 'Settings', path: '/settings' },
  
  
]