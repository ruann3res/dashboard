/**
 * Sistema de Feature Flags
 * 
 * Controle simples via variável no código.
 * 
 * Para ativar mocks temporários, altere a variável abaixo para true:
 */

// ============================================
// CONTROLE DE MOCKS - Altere aqui para ativar/desativar
// ============================================
const USE_MOCK_API = true
// ============================================

export const featureFlags = {
  /**
   * Verifica se deve usar mocks nas APIs
   * Quando ativo, todas as chamadas de API retornam dados mockados
   */
  useMockApi: () => USE_MOCK_API,
}
