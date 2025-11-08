import { useToast } from '@/hooks'
import { Button } from '@/components/ui/Button'

export const HomePage = () => {
  const { showToast } = useToast()

  const handleShowToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    showToast(`Este é um toast de ${type}!`, type)
  }

  return (
    <div className="p-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Hello World
          </h1>
          <p className="text-lg text-base-content/70">
            Bem-vindo ao dashboard UAIPY
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Teste os Componentes</h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Button variant="primary">Botão Primary</Button>
            <Button variant="secondary">Botão Secondary</Button>
            <Button variant="accent">Botão Accent</Button>
            <Button variant="ghost">Botão Ghost</Button>
            <Button variant="outline">Botão Outline</Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button 
              variant="success"
              onClick={() => handleShowToast('success')}
            >
              Toast Success
            </Button>
            <Button 
              variant="error"
              onClick={() => handleShowToast('error')}
            >
              Toast Error
            </Button>
            <Button 
              variant="warning"
              onClick={() => handleShowToast('warning')}
            >
              Toast Warning
            </Button>
            <Button 
              variant="info"
              onClick={() => handleShowToast('info')}
            >
              Toast Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

