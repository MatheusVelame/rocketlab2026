from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.database import get_db
from app.models.produto import Produto as ProdutoModel
from app.models.item_pedido import ItemPedido as ItemPedidoModel
from app.models.avaliacao_pedido import AvaliacaoPedido as AvaliacaoPedidoModel
from app.schemas.produto import Produto, ProdutoUpdate
from app.schemas.analytics import ProductAnalytics, ProductPerformance

router = APIRouter(prefix="/produtos", tags=["Produtos"])

@router.get("/", response_model=List[Produto])
def list_produtos(
    skip: int = 0, 
    limit: int = 20, 
    q: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ProdutoModel)
    if q:
        query = query.filter(ProdutoModel.nome_produto.contains(q))
    return query.offset(skip).limit(limit).all()

@router.get("/{id_produto}", response_model=Produto)
def get_produto(id_produto: str, db: Session = Depends(get_db)):
    db_produto = db.query(ProdutoModel).filter(ProdutoModel.id_produto == id_produto).first()
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return db_produto

@router.patch("/{id_produto}", response_model=Produto)
def update_produto(id_produto: str, produto_update: ProdutoUpdate, db: Session = Depends(get_db)):
    db_produto = db.query(ProdutoModel).filter(ProdutoModel.id_produto == id_produto).first()
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    update_data = produto_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_produto, key, value)
    
    db.commit()
    db.refresh(db_produto)
    return db_produto

@router.post("/", response_model=Produto, status_code=201)
def create_produto(produto: Produto, db: Session = Depends(get_db)):
    db_exists = db.query(ProdutoModel).filter(ProdutoModel.id_produto == produto.id_produto).first()
    if db_exists:
        raise HTTPException(status_code=400, detail="ID de produto já cadastrado")
    
    new_product = ProdutoModel(**produto.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.delete("/{id_produto}", status_code=204)
def delete_produto(id_produto: str, db: Session = Depends(get_db)):
    db_produto = db.query(ProdutoModel).filter(ProdutoModel.id_produto == id_produto).first()
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    db.delete(db_produto)
    db.commit()
    return None

@router.get("/{id_produto}/analytics", response_model=ProductAnalytics)
def get_produto_analytics(id_produto: str, db: Session = Depends(get_db)):
    db_produto = db.query(ProdutoModel).filter(ProdutoModel.id_produto == id_produto).first()
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    # Vendas e Receita
    sales_data = db.query(
        func.count(ItemPedidoModel.id_item).label("total_vendas"),
        func.sum(ItemPedidoModel.preco_BRL).label("receita_total"),
        func.avg(ItemPedidoModel.preco_BRL).label("preco_medio")
    ).filter(ItemPedidoModel.id_produto == id_produto).first()

    # Avaliações
    reviews_data = db.query(
        func.avg(AvaliacaoPedidoModel.avaliacao).label("avaliacao_media"),
        func.count(AvaliacaoPedidoModel.id_avaliacao).label("total_avaliacoes")
    ).join(
        ItemPedidoModel, ItemPedidoModel.id_pedido == AvaliacaoPedidoModel.id_pedido
    ).filter(ItemPedidoModel.id_produto == id_produto).first()

    performance = ProductPerformance(
        total_vendas=sales_data.total_vendas or 0,
        receita_total=sales_data.receita_total or 0.0,
        preco_medio=sales_data.preco_medio or 0.0,
        avaliacao_media=reviews_data.avaliacao_media or 0.0,
        total_avaliacoes=reviews_data.total_avaliacoes or 0
    )

    # Últimas 5 avaliações
    last_reviews = db.query(
        AvaliacaoPedidoModel.avaliacao,
        AvaliacaoPedidoModel.comentario,
        AvaliacaoPedidoModel.data_comentario
    ).join(
        ItemPedidoModel, ItemPedidoModel.id_pedido == AvaliacaoPedidoModel.id_pedido
    ).filter(
        ItemPedidoModel.id_produto == id_produto
    ).order_by(
        AvaliacaoPedidoModel.data_comentario.desc()
    ).limit(5).all()

    return ProductAnalytics(
        id_produto=db_produto.id_produto,
        nome_produto=db_produto.nome_produto,
        performance=performance,
        ultimas_avaliacoes=last_reviews
    )
