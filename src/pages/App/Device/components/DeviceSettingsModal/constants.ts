export const FORM_LABELS = {
    DEVICE_NAME: 'Nome do Dispositivo',
    CULTURA: 'Cultura',
    VAZAO: 'Vazão',
    LAT: 'Lat',
    LONGITUDE: 'Longitude',
  } as const
  
  export const CULTURA_OPTIONS = [
    { value: '', label: 'Selecione uma cultura' },
    { value: 'soja', label: 'Soja' },
    { value: 'milho', label: 'Milho' },
    { value: 'cafe', label: 'Café' },
    { value: 'algodao', label: 'Algodão' },
  ] as const
  
  export const INFO_LABELS = {
    STATUS: 'Status:',
    TYPE: 'Tipo:',
    PROJECT: 'Projeto:',
    LAST_UPDATE: 'Última atualização:',
  } as const
  
  export const INFO_VALUES = {
    TYPE: 'Estação Met.',
    STATUS_ACTIVATED: 'ativado',
  } as const
  
  export const BUTTON_LABELS = {
    SAVE: 'Salvar',
    DELETE_DEVICE: 'EXCLUIR DISPOSITIVO',
    CLOSE: 'Fechar',
  } as const
  
  export const MODAL_TITLE = 'Configurações do Dispositivo' as const
  
  export const DELETE_CONFIRM_MESSAGE = 'Tem certeza que deseja excluir este dispositivo?' as const
  
  export const TOAST_MESSAGES = {
    UPDATE_SUCCESS: 'Dispositivo atualizado com sucesso!',
    DELETE_SUCCESS: 'Dispositivo excluído com sucesso!',
  } as const
  
export const INFO_VALUES_EXTENDED = {
  ...INFO_VALUES,
  UNKNOWN_PROJECT: 'Desconhecido',
} as const

export const STATUS_OPTIONS = [
  { value: 'online', label: 'Ativo' },
  { value: 'offline', label: 'Inativo' },
] as const

export const DEVICE_TYPE_OPTIONS = [
  { value: 'actuator', label: 'Atuador' },
  { value: 'gateway', label: 'Gateway' },
] as const
      