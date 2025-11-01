import type { Project, Device } from "@/types";

const projects: Project[] = [
    {
      id: 'project-1',
      userId: '1',
      name: 'Projeto 1',
      description: 'Descrição do projeto 1',
      visibility: 'public',
      tags: ['tag1', 'tag2'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
]

const devices: Device[] = [
    {
      id: 'device-1',
      projectId: 'project-1',
      name: 'Dispositivo 1',
      description: 'Descrição do dispositivo 1',
      serialNumber: '1234567890',
      deviceType: 'sensor',
      status: 'online',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
        id: 'device-2',
        projectId: 'project-1',
        name: 'Dispositivo 2',
        description: 'Descrição do dispositivo 2',
        serialNumber: '1234567891',
        deviceType: 'sensor',
        status: 'online',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'device-3',
        projectId: 'project-1',
        name: 'Dispositivo 3',
        description: 'Descrição do dispositivo 3',
        serialNumber: '1234567892',
        deviceType: 'sensor',
        status: 'offline',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
  ]

export { projects, devices }
