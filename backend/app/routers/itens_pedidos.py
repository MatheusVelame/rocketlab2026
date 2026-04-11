from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
from datetime import date

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
    q: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    data_inicio: Optional[str] = Query(None),
    data_fim: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(
        ItemPedidoModel,
        ProdutoModel.nome_produto,
        PedidoModel.status
    ).join(
        ProdutoModel, ItemPedidoModel.id_produto == ProdutoModel.id_produto
    ).join(
        PedidoModel, ItemPedidoModel.id_pedido == PedidoModel.id_pedido
    )
    
    # Busca inteligente: ID do pedido ou Nome do produto
    if q and q.strip():
        query = query.filter(or_(
            ItemPedidoModel.id_pedido.contains(q),
            ProdutoModel.nome_produto.contains(q)
        ))
    
    # Filtro por Status Inteligente (Mapeia EN/PT)
    if status and status.strip():
        s = status.lower()
        if s == 'entregue' or s == 'delivered':
            query = query.filter(or_(PedidoModel.status.ilike('%entregue%'), PedidoModel.status.ilike('%delivered%')))
        elif s == 'enviado' or s == 'shipped':
            query = query.filter(or_(PedidoModel.status.ilike('%enviado%'), PedidoModel.status.ilike('%shipped%')))
        elif s == 'processando' or s == 'processing':
            query = query.filter(or_(PedidoModel.status.ilike('%processando%'), PedidoModel.status.ilike('%processing%')))
        elif s == 'cancelado' or s == 'canceled':
            query = query.filter(or_(PedidoModel.status.ilike('%cancelado%'), PedidoModel.status.ilike('%canceled%')))
        else:
            query = query.filter(PedidoModel.status.ilike(f'%{status}%'))
        
    # Filtro por Intervalo de Datas
    try:
        if data_inicio and data_inicio.strip():
            d_ini = date.fromisoformat(data_inicio)
            query = query.filter(PedidoModel.pedido_compra_timestamp >= d_ini)
        if data_fim and data_fim.strip():
            d_fim = date.fromisoformat(data_fim)
            query = query.filter(PedidoModel.pedido_compra_timestamp <= d_fim)
    except ValueError:
        pass
    
    total = query.count()
    results = query.offset(skip).limit(limit).all()
    
    items = []
    for item_model, produto_nome, pedido_status in results:
        item_dict = {
            "id_pedido": item_model.id_pedido,
            "id_item": item_model.id_item,
            "id_produto": item_model.id_produto,
            "id_vendedor": item_model.id_vendedor,
            "preco_BRL": item_model.preco_BRL,
            "preco_frete": item_model.preco_frete,
            "nome_produto": produto_nome,
            "status_pedido": pedido_status
        }
        items.append(item_dict)
    
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
