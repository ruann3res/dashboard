import { Link } from "react-router-dom"
import { Clock } from "@/components/ui/Icons/icons/clock"
import { AnimateIcon } from "@/components/ui/Icons/icons/icon"


export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 text-base-content p-6 animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute -inset-2 blur-xl bg-gradient-to-tr from-primary via-accent to-secondary opacity-30 rounded-full animate-pulse"></div>
        <span className="relative text-7xl lg:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-primary to-secondary select-none">
          404
        </span>
      </div>
      <h1 className="text-3xl font-bold mb-2 text-center">Página não encontrada</h1>
      <p className="mb-6 text-lg text-base-content/70 max-w-md text-center break-words hyphens-auto">
        Desculpe, não conseguimos encontrar o que você procura.
        <br className="hidden xs:inline" />
        Talvez você tenha digitado um endereço incorreto ou a página foi removida.
      </p>
      <Link
        to="/"
        className="btn btn-primary btn-lg shadow-lg transition-transform hover:scale-105 focus:outline-none"
      >
        Voltar para o início
      </Link>
      <div className="mt-10">
        <AnimateIcon animateOnHover>
          <Clock />
        </AnimateIcon>
      </div>
    </div>
  )
}

