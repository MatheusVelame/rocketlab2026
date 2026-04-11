from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class ItemPedidoBase(BaseModel):
    id_pedido: str
    id_item: int
    id_produto: str
    id_vendedor: str
    preco_BRL: float
    preco_frete: float

class ItemPedido(ItemPedidoBase):
    model_config = ConfigDict(from_attributes=True)

class ConsumidorMini(BaseModel):
    id: str
    nome: str
    cidade: str
    estado: str

class VendedorMini(BaseModel):
    id: str
    nome: str
    cidade: str
    estado: str

class ProdutoMini(BaseModel):
    id: str
    nome: str
    categoria: str

class ItemPedidoDetalhado(BaseModel):
    item: ItemPedido
    status_pedido: str
    data_compra: Optional[str] = None
    data_entrega: Optional[str] = None
    entrega_no_prazo: Optional[str] = None
    tempo_entrega_dias: Optional[float] = None
    diferenca_entrega_dias: Optional[float] = None
    consumidor: Optional[ConsumidorMini] = None
    vendedor: Optional[VendedorMini] = None
    produto: Optional[ProdutoMini] = None

    model_config = ConfigDict(from_attributes=True)
