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

export interface Review {
  avaliacao: number;
  comentario: string;
  data_comentario: string;
}

export interface ProductAnalytics {
  id_produto: string;
  nome_produto: string;
  performance: ProductPerformance;
  ultimas_avaliacoes: Review[];
}

export interface GlobalStats {
  total_receita: number;
  total_vendas: number;
  total_produtos: number;
  ticket_medio: number;
  top_categoria: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface Consumidor {
  id_consumidor: string;
  prefixo_cep: string;
  nome_consumidor: string;
  cidade: string;
  estado: string;
}

export interface Vendedor {
  id_vendedor: string;
  nome_vendedor: string;
  prefixo_cep: string;
  cidade: string;
  estado: string;
}

export interface PedidoItem {
  id_pedido: string;
  id_item: number;
  id_produto: string;
  id_vendedor: string;
  preco_BRL: number;
  preco_frete: number;
  nome_produto?: string;
  status_pedido?: string;
}

export interface PedidoItemDetalhado {
  item: PedidoItem;
  status_pedido: string;
  data_compra?: string;
  data_entrega?: string;
  entrega_no_prazo?: string;
  tempo_entrega_dias?: number;
  diferenca_entrega_dias?: number;
  consumidor?: {
    id: string;
    nome: string;
    cidade: string;
    estado: string;
  };
  vendedor?: {
    id: string;
    nome: string;
    cidade: string;
    estado: string;
  };
  produto?: {
    id: string;
    nome: string;
    categoria: string;
  };
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface DashboardStats {
  revenue_history: MonthlyRevenue[];
  status_distribution: Record<string, number>;
  total_revenue: number;
  total_orders: number;
  average_ticket: number;
  total_customers: number;
}
