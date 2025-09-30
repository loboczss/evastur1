export type PackageDTO = {
  id: string;
  nome: string;          // [Nome do DB]
  resumo?: string;       // [Resumo do DB]
  descricao?: string;    // [Texto longo do DB]
  preco?: string;        // [Preço formatado do DB]
  dias?: number;         // [Qtd de dias do DB]
  dataIda?: string;      // ISO (ex: 2025-12-01)
  dataVolta?: string;    // ISO (ex: 2025-12-05)
  local?: string;        // [Local/destino do DB]
  imagens?: string[];    // Até 5 URLs (ou caminhos do /public)
  // … acrescente campos que tiver no DB
};
