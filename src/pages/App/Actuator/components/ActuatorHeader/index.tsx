import { Button } from '@/components/ui/Button'

interface ActuatorHeaderProps {
  onCreateClick: () => void
}

export const ActuatorHeader = ({ onCreateClick }: ActuatorHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-base-content">Atuadores</h1>
      <Button
        variant="primary"
        onClick={onCreateClick}
      >
        Criar Atuador
      </Button>
    </div>
  )
}

