export type Device = {
        id: string,
        projectId: string,
        name: string,
        description: string,
        serialNumber: string,
        deviceType: DeviceType,
        status: DeviceStatus,
        createdAt: string,
        updatedAt: string,
}

export type DeviceType = 'actuator' | 'gateway'
export type DeviceStatus = 'online' | 'offline' | 'error'