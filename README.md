# UAIPY Dashboard

Dashboard web para gerenciamento de dispositivos IoT, projetos e atuadores.

## 🚀 Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **TanStack Query** - Gerenciamento de estado e cache de dados
- **Axios** - Cliente HTTP
- **Tailwind CSS + DaisyUI** - Estilização
- **React Hook Form** - Gerenciamento de formulários

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou pnpm

## 🛠️ Instalação

```bash
# Instalar dependências
npm install
# ou
pnpm install
```

## 🏃 Executando o Projeto

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── app/         # Componentes da aplicação (Sidebar, etc)
│   └── ui/           # Componentes de UI (Button, DataTable, etc)
├── contexts/         # Contextos React (Theme, Toast, Sidebar)
├── hooks/            # Custom hooks
├── lib/              # Utilitários e helpers
├── pages/            # Páginas da aplicação
│   ├── App/         # Páginas autenticadas
│   └── Auth/        # Páginas de autenticação
├── routes/           # Configuração de rotas
├── services/         # Serviços de API e mocks
└── types/            # Definições de tipos TypeScript
```

## 🔐 Autenticação

O sistema utiliza autenticação por telefone com código de verificação:

1. **Login**: Informe seu número de telefone
2. **Verificação**: Digite o código recebido
3. **Acesso**: Token JWT armazenado em cookies

## 📱 Funcionalidades

### Projetos
- Criar, editar e excluir projetos
- Listar projetos com paginação e filtros
- Gerenciar visibilidade (público/privado)
- Adicionar tags aos projetos

### Dispositivos
- Criar dispositivos (gateway ou actuator)
- Associar dispositivos a projetos
- Visualizar status dos dispositivos (online/offline/error)
- Gerenciar números de série

### Atuadores
- Criar e configurar atuadores
- Definir faixas de alerta e saúde
- Associar atuadores a dispositivos
- Configurar unidades de medida

## 🧪 Sistema de Mocks

O projeto possui um sistema de mocks para desenvolvimento quando o backend está offline.

**Para ativar os mocks:**

Edite o arquivo `src/lib/feature-flags.ts`:

```typescript
const USE_MOCK_API = true  // true = mocks ativados
```

Veja mais detalhes em [docs/MOCKS.md](./docs/MOCKS.md)

## 🌐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📚 Documentação Adicional

- [Documentação de Mocks](./docs/MOCKS.md) - Guia completo sobre o sistema de mocks

## 🎨 Tema

O dashboard suporta temas claro/escuro através do DaisyUI. O tema pode ser alternado via componente `ThemeToggle`.

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🔧 Desenvolvimento

### Adicionando Novas Rotas

Edite `src/routes/routes.tsx` para adicionar novas rotas.

### Adicionando Novos Hooks

Os hooks de API estão em `src/hooks/` e utilizam TanStack Query para cache e sincronização.

### Estrutura de API

As chamadas de API são centralizadas em:
- `src/services/api.ts` - Funções de requisição (get, post, put, delete)
- `src/services/http.ts` - Configuração do Axios com interceptors

## 📄 Licença

Este projeto é MIT-2.
