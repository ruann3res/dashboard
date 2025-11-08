import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useAuthVerify } from '@/hooks'

interface VerifyFormData {
  token: string
}

export const VerifyPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { mutate: verify, isPending: isLoading } = useAuthVerify()
  const [tempToken, setTempToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('temp_auth_token')
    if (token && token !== 'undefined' && token !== 'null' && token.trim() !== '') {
      setTempToken(token)
    } else {
      localStorage.removeItem('temp_auth_token')
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VerifyFormData>({
    defaultValues: {
      token: '',
    },
  })

  useEffect(() => {
    if (tempToken && tempToken !== 'undefined' && tempToken !== 'null' && tempToken.trim() !== '') {
      setValue('token', tempToken)
    }
  }, [tempToken, setValue])

  const onSubmit = (data: VerifyFormData) => {
    verify(data.token, {
      onSuccess: () => {
        localStorage.removeItem('temp_auth_token')
        const from = (location.state as { from?: string })?.from || '/'
        navigate(from)
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
              Verifique o código enviado para seu telefone
            </p>
            <div className="mt-12 space-y-4 text-sm opacity-80">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span>Insira o código recebido via SMS</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span>O código será preenchido automaticamente</span>
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
            <p className="text-base-content/70 text-lg">Verificar código</p>
          </div>

          <div className="hidden lg:block mb-10 space-y-3">
            <h2 className="text-4xl font-bold text-base-content tracking-tight">Verificar código</h2>
            <p className="text-base-content/70 text-lg">Digite o código recebido via SMS</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="token" className="block text-sm font-semibold text-base-content">
                  Código de verificação
                </label>
                <input
                  id="token"
                  type="text"
                  {...register('token', {
                    required: 'Código é obrigatório',
                    minLength: {
                      value: 4,
                      message: 'Código deve ter pelo menos 4 caracteres',
                    },
                  })}
                  className={`input input-bordered w-full rounded-lg h-12 focus:input-primary transition-colors ${
                    errors.token ? 'input-error' : ''
                  }`}
                  placeholder="Digite o código recebido"
                  autoComplete="off"
                />
                {errors.token && (
                  <p className="text-xs text-error">{errors.token.message}</p>
                )}
                {!errors.token && tempToken && (
                  <p className="text-xs text-base-content/60">
                    Código preenchido automaticamente
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
                  Verificando...
                </span>
              ) : (
                'Verificar'
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-base-content/70 pt-4">
            <p>
              Não recebeu o código?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Voltar ao login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

