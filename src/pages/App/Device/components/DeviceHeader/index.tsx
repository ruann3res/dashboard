import { Button } from '@/components/ui/Button'

interface DeviceHeaderProps {
  onCreateClick: () => void
}

export const DeviceHeader = ({ onCreateClick }: DeviceHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-warning">
        Devices Page
      </h1>
      <Button
        variant="primary"
        onClick={onCreateClick}
      >
        Criar Dispositivo
      </Button>
    </div>
  )
}

