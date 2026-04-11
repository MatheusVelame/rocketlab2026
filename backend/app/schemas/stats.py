from pydantic import BaseModel
from typing import List, TypeVar, Generic

T = TypeVar('T')

class GlobalStats(BaseModel):
    total_receita: float
    total_vendas: int
    total_produtos: int
    ticket_medio: float
    top_categoria: str

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int = 20
    pages: int
