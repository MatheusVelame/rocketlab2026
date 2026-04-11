from pydantic import BaseModel
from typing import List
from .produto import Produto

class PaginatedProdutos(BaseModel):
    items: List[Produto]
    total: int
    page: int
    size: int
    pages: int
