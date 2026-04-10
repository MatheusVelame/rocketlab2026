from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProductPerformance(BaseModel):
    total_vendas: int
    receita_total: float
    preco_medio: float
    avaliacao_media: float
    total_avaliacoes: int

class ReviewSummary(BaseModel):
    avaliacao: int
    comentario: Optional[str]
    data_comentario: Optional[datetime]

class ProductAnalytics(BaseModel):
    id_produto: str
    nome_produto: str
    performance: ProductPerformance
    ultimas_avaliacoes: List[ReviewSummary]
