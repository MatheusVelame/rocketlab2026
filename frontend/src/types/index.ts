export interface Produto {
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  url_imagem?: string;
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

export interface ReviewSummary {
  avaliacao: number;
  comentario: string | null;
  data_comentario: string | null;
}

export interface ProductAnalytics {
  id_produto: string;
  nome_produto: string;
  performance: ProductPerformance;
  ultimas_avaliacoes: ReviewSummary[];
}
