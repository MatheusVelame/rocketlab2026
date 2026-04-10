from pydantic import BaseModel
from typing import List

class ProductPerformance(BaseModel):
    total_vendas: int
    receita_total: float
    preco_medio: float
    avaliacao_media: float
    total_avaliacoes: int

class ProductAnalytics(BaseModel):
    id_produto: str
    nome_produto: str
    performance: ProductPerformance
