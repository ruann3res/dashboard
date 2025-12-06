# Sistema de Mocks Temporários

Este projeto possui um sistema de feature flags que permite usar mocks temporários quando o backend está offline.

## Como Ativar os Mocks

Edite o arquivo `src/lib/feature-flags.ts` e altere a variável:

```typescript
const USE_MOCK_API = true  // true para ativar, false para desativar
```

É só isso! Não precisa de configuração adicional.

## O que está mockado?

Todos os endpoints da API estão mockados:

### Autenticação
- `POST /auth` - Login com telefone
- `POST /auth/verify` - Verificação de código

### Usuários
- `POST /users` - Criação de usuário

### Projetos
- `GET /projects` - Lista de projetos (com paginação e filtros)
- `GET /projects/:id` - Detalhes de um projeto
- `POST /projects` - Criar projeto
- `PUT /projects/:id` - Atualizar projeto
- `DELETE /projects/:id` - Excluir projeto

### Dispositivos
- `GET /devices` - Lista de dispositivos (com filtro por projeto)
- `GET /devices/:id` - Detalhes de um dispositivo
- `POST /devices` - Criar dispositivo
- `PUT /devices/:id` - Atualizar dispositivo
- `DELETE /devices/:id` - Excluir dispositivo

### Atuadores
- `GET /actors` - Lista de atuadores (com filtro por dispositivo)
- `GET /actors/:id` - Detalhes de um atuador
- `POST /actors` - Criar atuador
- `PUT /actors/:id` - Atualizar atuador
- `DELETE /actors/:id` - Excluir atuador

## Dados Mockados Iniciais

O sistema vem com alguns dados pré-configurados:

- **3 Projetos** de exemplo
- **3 Dispositivos** distribuídos entre os projetos
- **2 Atuadores** associados aos dispositivos

Você pode criar, editar e excluir dados normalmente - eles serão mantidos em memória durante a sessão do navegador.

## Comportamento

- **Delays simulados**: As requisições têm delays de 400-1000ms para simular latência de rede
- **Validações básicas**: Algumas validações simples são implementadas (ex: token de verificação)
- **Persistência em memória**: Os dados são mantidos em memória durante a sessão, mas são perdidos ao recarregar a página
- **Logs no console**: Quando os mocks estão ativos, você verá logs no console indicando quais chamadas estão sendo mockadas

## Desenvolvimento

Os arquivos relacionados aos mocks estão em:

- `src/lib/feature-flags.ts` - Sistema de feature flags (altere `USE_MOCK_API` aqui)
- `src/services/mocks.ts` - Implementação dos mocks
- `src/services/api.ts` - Interceptação das chamadas de API

Para adicionar novos mocks ou modificar os existentes, edite o arquivo `src/services/mocks.ts`.
