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

type DeviceType = 'sensor' | 'actuator'
type DeviceStatus = 'online' | 'offline'