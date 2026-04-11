from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.database import get_db
from app.models.item_pedido import ItemPedido as ItemPedidoModel
from app.models.pedido import Pedido as PedidoModel
from app.models.consumidor import Consumidor as ConsumidorModel
from app.models.vendedor import Vendedor as VendedorModel
from app.models.produto import Produto as ProdutoModel
from app.schemas.stats import PaginatedResponse
from app.schemas.item_pedido import ItemPedido, ItemPedidoDetalhado

router = APIRouter(prefix="/itens-pedidos", tags=["Itens Pedidos"])

@router.get("/", response_model=PaginatedResponse[ItemPedido])
def list_itens_pedidos(
    skip: int = 0, 
    limit: int = 20, 
    q: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ItemPedidoModel)
    if q:
        query = query.filter(ItemPedidoModel.id_pedido.contains(q))
    
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    
    return PaginatedResponse(
        items=items,
        total=total,
        page=skip // limit + 1,
        pages=(total + limit - 1) // limit
    )

@router.get("/{id_pedido}/{id_item}/detalhes", response_model=ItemPedidoDetalhado)
def get_item_detalhes(id_pedido: str, id_item: int, db: Session = Depends(get_db)):
    db_item = db.query(ItemPedidoModel).filter(
        ItemPedidoModel.id_pedido == id_pedido,
        ItemPedidoModel.id_item == id_item
    ).first()

    if not db_item:
        raise HTTPException(status_code=404, detail="Item não encontrado")

    db_pedido = db.query(PedidoModel).filter(PedidoModel.id_pedido == id_pedido).first()
    
    consumidor = db.query(ConsumidorModel).filter(ConsumidorModel.id_consumidor == db_pedido.id_consumidor).first() if db_pedido else None
    vendedor = db.query(VendedorModel).filter(VendedorModel.id_vendedor == db_item.id_vendedor).first()
    produto = db.query(ProdutoModel).filter(ProdutoModel.id_produto == db_item.id_produto).first()

    prazo = "N/A"
    if db_pedido and db_pedido.entrega_no_prazo:
        prazo = "SIM" if db_pedido.entrega_no_prazo.strip().upper() == "SIM" else "NAO"

    return {
        "item": db_item,
        "status_pedido": db_pedido.status if db_pedido else "desconhecido",
        "data_compra": db_pedido.pedido_compra_timestamp.isoformat() if db_pedido and db_pedido.pedido_compra_timestamp else None,
        "data_entrega": db_pedido.pedido_entregue_timestamp.isoformat() if db_pedido and db_pedido.pedido_entregue_timestamp else None,
        "entrega_no_prazo": prazo,
        "tempo_entrega_dias": db_pedido.tempo_entrega_dias if db_pedido else None,
        "diferenca_entrega_dias": db_pedido.diferenca_entrega_dias if db_pedido else None,
        "consumidor": {
            "id": consumidor.id_consumidor,
            "nome": consumidor.nome_consumidor if consumidor else f"Consumidor {db_pedido.id_consumidor[:8]}",
            "cidade": consumidor.cidade,
            "estado": consumidor.estado
        } if consumidor else None,
        "vendedor": {
            "id": vendedor.id_vendedor,
            "nome": vendedor.nome_vendedor if vendedor else f"Vendedor {db_item.id_vendedor[:8]}",
            "cidade": vendedor.cidade,
            "estado": vendedor.estado
        } if vendedor else None,
        "produto": {
            "id": produto.id_produto,
            "nome": produto.nome_produto,
            "categoria": produto.categoria_produto
        } if produto else None
    }
