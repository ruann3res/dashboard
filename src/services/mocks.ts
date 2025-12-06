/**
 * Mocks temporários para APIs
 * 
 * Este arquivo contém mocks para todas as APIs do sistema.
 * Os mocks simulam o comportamento real da API com delays e dados realistas.
 */

import type { Project, Device } from '@/types'

// Helper para simular delay de rede
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Tipos para atuadores (formato da API)
interface ActorApiResponse {
  id: string
  device_id: string
  name: string
  unit_of_measurement: string
  alert?: {
    min_value: number
    max_value: number
  }
  health?: {
    min_value: number
    max_value: number
  }
  created_at: string
  updated_at: string
}

// Dados mockados
let mockProjects: Project[] = [
  {
    id: '1',
    userId: 'user-1',
    name: 'Projeto Monitoramento Ambiental',
    description: 'Sistema de monitoramento de temperatura e umidade',
    visibility: 'private' as const,
    tags: ['iot', 'ambiente', 'temperatura'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'user-1',
    name: 'Projeto Agricultura Inteligente',
    description: 'Monitoramento de solo e irrigação automática',
    visibility: 'public' as const,
    tags: ['agricultura', 'irrigação', 'solo'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: 'user-1',
    name: 'Projeto Energia Solar',
    description: 'Monitoramento de painéis solares e produção de energia',
    visibility: 'public' as const,
    tags: ['energia', 'solar', 'sustentabilidade'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let mockDevices: Device[] = [
  {
    id: 'device-1',
    projectId: '1',
    name: 'Sensor Temperatura 01',
    description: 'Sensor de temperatura ambiente',
    serialNumber: 'SN-TEMP-001',
    deviceType: 'gateway' as const,
    status: 'online' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'device-2',
    projectId: '1',
    name: 'Sensor Umidade 01',
    description: 'Sensor de umidade do ar',
    serialNumber: 'SN-UMID-001',
    deviceType: 'gateway' as const,
    status: 'online' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'device-3',
    projectId: '2',
    name: 'Atuador Irrigação 01',
    description: 'Sistema de irrigação automática',
    serialNumber: 'SN-IRR-001',
    deviceType: 'actuator' as const,
    status: 'online' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let mockActuators: ActorApiResponse[] = [
  {
    id: 'actor-1',
    device_id: 'device-1',
    name: 'Temperatura',
    unit_of_measurement: '°C',
    alert: {
      min_value: 10,
      max_value: 35,
    },
    health: {
      min_value: 15,
      max_value: 30,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'actor-2',
    device_id: 'device-2',
    name: 'Umidade',
    unit_of_measurement: '%',
    alert: {
      min_value: 30,
      max_value: 80,
    },
    health: {
      min_value: 40,
      max_value: 70,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Função para gerar ID único
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Função para gerar token mockado
const generateMockToken = () => `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

/**
 * Mocks para autenticação
 */
export const mockAuth = {
  login: async (_body: { phone: string }) => {
    await delay(800)
    
    return {
      success: true,
      message: 'Código de verificação enviado com sucesso!',
      data: {
        token: generateMockToken(),
      },
    }
  },

  verify: async (body: { token: string }) => {
    await delay(1000)
    
    // Simula validação do token
    if (!body.token || body.token.length < 10) {
      throw {
        response: {
          status: 400,
          data: {
            success: false,
            message: 'Código de verificação inválido',
          },
        },
      }
    }

    return {
      success: true,
      message: 'Autenticação verificada com sucesso!',
      data: {
        token: generateMockToken(),
      },
    }
  },
}

/**
 * Mocks para usuários
 */
export const mockUsers = {
  create: async (_body: { name: string; email: string; phone: string; role: string }) => {
    await delay(1000)

    return {
      success: true,
      message: 'Usuário criado com sucesso!',
      data: {
        token: generateMockToken(),
        userId: generateId(),
      },
    }
  },
}

/**
 * Mocks para projetos
 */
export const mockProjectsApi = {
  list: async (url: string) => {
    await delay(600)

    const urlObj = new URL(`http://localhost${url}`)
    const page = parseInt(urlObj.searchParams.get('page') || '1')
    const limit = parseInt(urlObj.searchParams.get('limit') || '10')
    const search = urlObj.searchParams.get('search') || ''
    const type = urlObj.searchParams.get('type') || 'user'

    let filtered = [...mockProjects]

    // Filtro por busca
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filtro por tipo (simplificado)
    if (type === 'public') {
      filtered = filtered.filter((p) => p.visibility === 'public')
    }

    const start = (page - 1) * limit
    const end = start + limit
    const paginated = filtered.slice(start, end)

    return {
      success: true,
      data: {
        projects: paginated,
        total: filtered.length,
        page,
        limit,
      },
      timestamp: new Date().toISOString(),
    }
  },

  get: async (url: string) => {
    await delay(400)

    const id = url.split('/').pop()
    const project = mockProjects.find((p) => p.id === id)

    if (!project) {
      throw {
        response: {
          status: 404,
          data: {
            success: false,
            message: 'Projeto não encontrado',
          },
        },
      }
    }

    return {
      success: true,
      data: {
        project,
      },
      timestamp: new Date().toISOString(),
    }
  },

  create: async (body: { name: string; description: string; visibility: string; tags?: string[] }) => {
    await delay(800)

    const newProject = {
      id: generateId(),
      userId: 'user-1',
      name: body.name,
      description: body.description,
      visibility: body.visibility as 'public' | 'private',
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockProjects.push(newProject)

    return {
      success: true,
      data: {
        project: newProject,
      },
      timestamp: new Date().toISOString(),
    }
  },

  update: async (url: string, body: Partial<{ name: string; description: string; visibility: string; tags: string[] }>) => {
    await delay(600)

    const id = url.split('/').pop()
    const projectIndex = mockProjects.findIndex((p) => p.id === id)

    if (projectIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            success: false,
            message: 'Projeto não encontrado',
          },
        },
      }
    }

    const updatedProject = {
      ...mockProjects[projectIndex],
      ...(body.name && { name: body.name }),
      ...(body.description && { description: body.description }),
      ...(body.visibility && { visibility: body.visibility as 'public' | 'private' }),
      ...(body.tags && { tags: body.tags }),
      updatedAt: new Date().toISOString(),
    }
    mockProjects[projectIndex] = updatedProject

    return {
      success: true,
      data: {
        project: mockProjects[projectIndex],
      },
      timestamp: new Date().toISOString(),
    }
  },

  delete: async (url: string) => {
    await delay(500)

    const id = url.split('/').pop()
    const projectIndex = mockProjects.findIndex((p) => p.id === id)

    if (projectIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            success: false,
            message: 'Projeto não encontrado',
          },
        },
      }
    }

    mockProjects.splice(projectIndex, 1)

    return {
      success: true,
      data: {
        message: 'Projeto excluído com sucesso',
      },
      timestamp: new Date().toISOString(),
    }
  },
}

/**
 * Mocks para dispositivos
 */
export const mockDevicesApi = {
  list: async (url: string) => {
    await delay(600)

    const urlObj = new URL(`http://localhost${url}`)
    const projectId = urlObj.searchParams.get('projectId')

    let filtered = [...mockDevices]

    if (projectId) {
      filtered = filtered.filter((d) => d.projectId === projectId)
    }

    return {
      success: true,
      data: {
        devices: filtered,
        total: filtered.length,
      },
      timestamp: new Date().toISOString(),
    }
  },

  get: async (url: string) => {
    await delay(400)

    const id = url.split('/').pop()
    const device = mockDevices.find((d) => d.id === id)

    if (!device) {
      throw {
        response: {
          status: 404,
          data: {
            success: false,
            message: 'Dispositivo não encontrado',
          },
        },
      }
    }

    return {
      success: true,
      data: {
        device,
      },
      timestamp: new Date().toISOString(),
    }
  },

  create: async (body: { projectId: string; name: string; description: string; deviceType: string; status?: string }) => {
    await delay(800)

    const newDevice = {
      id: generateId(),
      projectId: body.projectId,
      name: body.name,
      description: body.description,
      serialNumber: `SN-${body.deviceType.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      deviceType: body.deviceType as 'actuator' | 'gateway',
      status: (body.status || 'online') as 'online' | 'offline' | 'error',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockDevices.push(newDevice as Device)

    return {
      success: true,
      data: {
        serialNumber: newDevice.serialNumber,
      },
      timestamp: new Date().toISOString(),
    }
  },

  update: async (url: string, body: Partial<{ projectId: string; name: string; description: string; deviceType: string; status: string }>) => {
    await delay(600)

    const id = url.split('/').pop()
    const deviceIndex = mockDevices.findIndex((d) => d.id === id)

    if (deviceIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            success: false,
            message: 'Dispositivo não encontrado',
          },
        },
      }
    }

    const updatedDevice: Device = {
      ...mockDevices[deviceIndex],
      ...(body.projectId && { projectId: body.projectId }),
      ...(body.name && { name: body.name }),
      ...(body.description && { description: body.description }),
      ...(body.deviceType && { deviceType: body.deviceType as 'actuator' | 'gateway' }),
      ...(body.status && { status: body.status as 'online' | 'offline' | 'error' }),
      updatedAt: new Date().toISOString(),
    } as Device
    mockDevices[deviceIndex] = updatedDevice

    return {
      success: true,
      data: {
        device: mockDevices[deviceIndex],
      },
      timestamp: new Date().toISOString(),
    }
  },

  delete: async (url: string) => {
    await delay(500)

    const id = url.split('/').pop()
    const deviceIndex = mockDevices.findIndex((d) => d.id === id)

    if (deviceIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            success: false,
            message: 'Dispositivo não encontrado',
          },
        },
      }
    }

    // Remove também os atuadores associados
    mockActuators = mockActuators.filter((a) => a.device_id !== id)
    mockDevices.splice(deviceIndex, 1)

    return {
      success: true,
      data: {
        message: 'Dispositivo excluído com sucesso',
      },
      timestamp: new Date().toISOString(),
    }
  },
}

/**
 * Mocks para atuadores
 */
export const mockActuatorsApi = {
  list: async (url: string) => {
    await delay(600)

    const urlObj = new URL(`http://localhost${url}`)
    const deviceId = urlObj.searchParams.get('device_id')

    let filtered = [...mockActuators]

    if (deviceId) {
      filtered = filtered.filter((a) => a.device_id === deviceId)
    }

    return {
      success: true,
      data: {
        actors: filtered,
      },
      timestamp: new Date().toISOString(),
    }
  },

  get: async (url: string) => {
    await delay(400)

    const id = url.split('/').pop()
    const actuator = mockActuators.find((a) => a.id === id)

    if (!actuator) {
      throw {
        response: {
          status: 404,
          data: {
            success: false,
            message: 'Atuador não encontrado',
          },
        },
      }
    }

    return {
      success: true,
      data: {
        actor: actuator,
      },
      timestamp: new Date().toISOString(),
    }
  },

  create: async (body: { device_id: string; name: string; unit_of_measurement: string; alert?: { min_value: number; max_value: number }; health?: { min_value: number; max_value: number } }) => {
    await delay(800)

    const newActuator: ActorApiResponse = {
      id: generateId(),
      device_id: body.device_id,
      name: body.name,
      unit_of_measurement: body.unit_of_measurement,
      ...(body.alert && { alert: body.alert }),
      ...(body.health && { health: body.health }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockActuators.push(newActuator as ActorApiResponse)

    return {
      success: true,
      data: {
        actor: newActuator,
      },
      timestamp: new Date().toISOString(),
    }
  },

  update: async (url: string, body: Partial<{ name: string; unit_of_measurement: string; alert: { min_value: number; max_value: number }; health: { min_value: number; max_value: number } }>) => {
    await delay(600)

    const id = url.split('/').pop()
    const actuatorIndex = mockActuators.findIndex((a) => a.id === id)

    if (actuatorIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            success: false,
            message: 'Atuador não encontrado',
          },
        },
      }
    }

    const updatedActuator: ActorApiResponse = {
      ...mockActuators[actuatorIndex],
      ...(body.name && { name: body.name }),
      ...(body.unit_of_measurement && { unit_of_measurement: body.unit_of_measurement }),
      ...(body.alert && { alert: body.alert }),
      ...(body.health && { health: body.health }),
      updated_at: new Date().toISOString(),
    } as ActorApiResponse
    mockActuators[actuatorIndex] = updatedActuator

    return {
      success: true,
      data: {
        actor: mockActuators[actuatorIndex],
      },
      timestamp: new Date().toISOString(),
    }
  },

  delete: async (url: string) => {
    await delay(500)

    const id = url.split('/').pop()
    const actuatorIndex = mockActuators.findIndex((a) => a.id === id)

    if (actuatorIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            success: false,
            message: 'Atuador não encontrado',
          },
        },
      }
    }

    mockActuators.splice(actuatorIndex, 1)

    return {
      success: true,
      data: {
        message: 'Atuador excluído com sucesso',
      },
      timestamp: new Date().toISOString(),
    }
  },
}

/**
 * Router de mocks - roteia a requisição para o mock apropriado
 */
export const routeMock = async (method: string, url: string, body?: any) => {
  // Remove query params para roteamento
  const baseUrl = url.split('?')[0]

  // Auth
  if (baseUrl === '/auth' && method === 'POST') {
    return mockAuth.login(body)
  }

  if (baseUrl === '/auth/verify' && method === 'POST') {
    return mockAuth.verify(body)
  }

  // Users
  if (baseUrl === '/users' && method === 'POST') {
    return mockUsers.create(body)
  }

  // Projects
  if (baseUrl === '/projects' && method === 'GET') {
    return mockProjectsApi.list(url)
  }

  if (baseUrl.startsWith('/projects/') && method === 'GET') {
    return mockProjectsApi.get(url)
  }

  if (baseUrl === '/projects' && method === 'POST') {
    return mockProjectsApi.create(body)
  }

  if (baseUrl.startsWith('/projects/') && method === 'PUT') {
    return mockProjectsApi.update(url, body)
  }

  if (baseUrl.startsWith('/projects/') && method === 'DELETE') {
    return mockProjectsApi.delete(url)
  }

  // Devices
  if (baseUrl === '/devices' && method === 'GET') {
    return mockDevicesApi.list(url)
  }

  if (baseUrl.startsWith('/devices/') && method === 'GET') {
    return mockDevicesApi.get(url)
  }

  if (baseUrl === '/devices' && method === 'POST') {
    return mockDevicesApi.create(body)
  }

  if (baseUrl.startsWith('/devices/') && method === 'PUT') {
    return mockDevicesApi.update(url, body)
  }

  if (baseUrl.startsWith('/devices/') && method === 'DELETE') {
    return mockDevicesApi.delete(url)
  }

  // Actuators
  if (baseUrl === '/actors' && method === 'GET') {
    return mockActuatorsApi.list(url)
  }

  if (baseUrl.startsWith('/actors/') && method === 'GET') {
    return mockActuatorsApi.get(url)
  }

  if (baseUrl === '/actors' && method === 'POST') {
    return mockActuatorsApi.create(body)
  }

  if (baseUrl.startsWith('/actors/') && method === 'PUT') {
    return mockActuatorsApi.update(url, body)
  }

  if (baseUrl.startsWith('/actors/') && method === 'DELETE') {
    return mockActuatorsApi.delete(url)
  }

  // Rota não encontrada
  throw {
    response: {
      status: 404,
      data: {
        success: false,
        message: `Mock não implementado para ${method} ${baseUrl}`,
      },
    },
  }
}
