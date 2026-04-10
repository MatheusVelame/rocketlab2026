export interface Produto {
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas?: number;
  comprimento_centimetros?: number;
  altura_centimetros?: number;
  largura_centimetros?: number;
}

export interface ProductPerformance {
  total_vendas: number;
  receita_total: number;
  preco_medio: number;
  avaliacao_media: number;
  total_avaliacoes: number;
}

export interface ProductAnalytics {
  id_produto: string;
  nome_produto: string;
  performance: ProductPerformance;
}
