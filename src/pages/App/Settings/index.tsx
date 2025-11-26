
export const SettingsPage = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-base-content">Configurações</h1>
        </div>

        <div className="card bg-base-100 shadow-xl p-12 rounded-box">
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
            {/* Título */}
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-base-content">
                Em Construção
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full"></div>
            </div>

            {/* Mensagem criativa */}
            <div className="max-w-2xl space-y-4">
              <p className="text-xl text-base-content/80 leading-relaxed">
                Estamos trabalhando duro para trazer uma experiência incrível de configurações!
              </p>
              <p className="text-lg text-base-content/70">
                Em breve, você poderá editar seus dados pessoais, ajustar preferências e personalizar sua conta.
              </p>
            </div>

            {/* Features que virão */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-3xl">
              <div className="card bg-base-200 border border-base-300 p-6 rounded-xl">
                <div className="text-3xl mb-3">👤</div>
                <h3 className="font-semibold text-base-content mb-2">Dados Pessoais</h3>
                <p className="text-sm text-base-content/70">
                  Edite nome, e-mail, telefone e outras informações
                </p>
              </div>

              <div className="card bg-base-200 border border-base-300 p-6 rounded-xl">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="font-semibold text-base-content mb-2">Segurança</h3>
                <p className="text-sm text-base-content/70">
                  Gerencie senhas e configurações de segurança
                </p>
              </div>

              <div className="card bg-base-200 border border-base-300 p-6 rounded-xl">
                <div className="text-3xl mb-3">⚙️</div>
                <h3 className="font-semibold text-base-content mb-2">Preferências</h3>
                <p className="text-sm text-base-content/70">
                  Personalize notificações e preferências do sistema
                </p>
              </div>
            </div>

            {/* Mensagem de espera */}
            <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-base-content/80">
                <span className="font-semibold">Fique ligado!</span> Estamos sempre melhorando a plataforma para você.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

