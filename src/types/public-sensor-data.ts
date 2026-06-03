export interface PublicActorDataPoint {
  id: string
  value: number
  timestamp: string
}

export interface PublicActorData {
  actorId: string
  actorName: string
  unitOfMeasurement: string
  data: PublicActorDataPoint[]
}

export interface PublicDeviceData {
  deviceId: string
  deviceName: string
  serialNumber: string
  deviceType: string
  status: string
  actors: PublicActorData[]
}

export interface PublicProjectData {
  projectId: string
  projectName: string
  devices: PublicDeviceData[]
}

export interface PublicProjectsDataResponse {
  success: boolean
  data: {
    projects?: PublicProjectData[]
    total?: number
    projectId?: string
    projectName?: string
    devices?: PublicDeviceData[]
  }
  timestamp: string
}

export interface PublicProjectDataResponse {
  success: boolean
  data: PublicProjectData
  timestamp: string
}
