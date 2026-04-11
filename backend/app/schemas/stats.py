from pydantic import BaseModel
from typing import List

class GlobalStats(BaseModel):
    total_receita: float
    total_vendas: int
    total_produtos: int
    ticket_medio: float
    top_categoria: str
