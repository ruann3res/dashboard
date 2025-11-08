import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks'

interface LoginFormData {
  phone: string
}

export const LoginPage = () => {
  const navigate = useNavigate()
  const { mutate: login, isPending: isLoading } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    defaultValues: {
      phone: '',
    },
  })

  const phoneValue = watch('phone')

  const formatPhone = (value: string) => {
    return value.replace(/\D/g, '')
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setValue('phone', formatted, { shouldValidate: true })
  }

  const onSubmit = (data: LoginFormData) => {
    login(data.phone, {
      onSuccess: () => {
        navigate('/verify', { state: { from: '/' } })
      },
    })
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="max-w-md space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-bold tracking-tight">UAIPY</h1>
              <div className="h-1 w-24 bg-white/30 mx-auto rounded-full" />
            </div>
            <p className="text-xl opacity-95 text-center leading-relaxed">
              Gerencie seus dispositivos IoT de forma inteligente e eficiente
            </p>
            <div className="mt-12 space-y-4 text-sm opacity-80">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span>Monitoramento em tempo real</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span>Análise de dados avançada</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span>Controle total dos seus dispositivos</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-base-100">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden mb-8 space-y-2">
            <h1 className="text-5xl font-bold text-primary tracking-tight">UAIPY</h1>
            <p className="text-base-content/70 text-lg">Bem-vindo de volta</p>
          </div>

          <div className="hidden lg:block mb-10 space-y-3">
            <h2 className="text-4xl font-bold text-base-content tracking-tight">Bem-vindo de volta</h2>
            <p className="text-base-content/70 text-lg">Entre com seu telefone para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-base-content">
                  Telefone
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone', {
                    required: 'Telefone é obrigatório',
                    minLength: {
                      value: 10,
                      message: 'Telefone deve ter pelo menos 10 dígitos',
                    },
                    maxLength: {
                      value: 15,
                      message: 'Telefone deve ter no máximo 15 dígitos',
                    },
                    pattern: {
                      value: /^\d+$/,
                      message: 'Digite apenas números',
                    },
                  })}
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  className={`input input-bordered w-full rounded-lg h-12 focus:input-primary transition-colors ${
                    errors.phone ? 'input-error' : ''
                  }`}
                  placeholder="5511999999999"
                  autoComplete="tel"
                  maxLength={15}
                />
                {errors.phone && (
                  <p className="text-xs text-error">{errors.phone.message}</p>
                )}
                {!errors.phone && (
                  <p className="text-xs text-base-content/60">
                    Digite apenas números (ex: 5511999999999)
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 rounded-lg text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="loading loading-spinner loading-sm mr-2" />
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-base-content/70 pt-4">
            <p>
              Não tem uma conta?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

