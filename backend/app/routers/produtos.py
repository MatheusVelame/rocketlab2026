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
from app.schemas.stats import GlobalStats

router = APIRouter(prefix="/produtos", tags=["Produtos"])

@router.get("/stats/global", response_model=GlobalStats)
def get_global_stats(db: Session = Depends(get_db)):
    total_receita = db.query(func.sum(ItemPedidoModel.preco_BRL)).scalar() or 0.0
    total_vendas = db.query(func.count(ItemPedidoModel.id_item)).scalar() or 0
    total_produtos = db.query(func.count(ProdutoModel.id_produto)).scalar() or 0
    
    # Top Categoria (mais vendida)
    top_cat_row = db.query(
        ProdutoModel.categoria_produto,
        func.count(ItemPedidoModel.id_item).label("vendas")
    ).join(
        ItemPedidoModel, ProdutoModel.id_produto == ItemPedidoModel.id_produto
    ).group_by(
        ProdutoModel.categoria_produto
    ).order_by(func.count(ItemPedidoModel.id_item).desc()).first()
    
    top_categoria = top_cat_row.categoria_produto if top_cat_row else "N/A"
    ticket_medio = total_receita / total_vendas if total_vendas > 0 else 0.0

    return GlobalStats(
        total_receita=total_receita,
        total_vendas=total_vendas,
        total_produtos=total_produtos,
        ticket_medio=ticket_medio,
        top_categoria=top_categoria
    )

@router.get("/categorias", response_model=List[str])
def list_categorias(db: Session = Depends(get_db)):
    return [c[0] for c in db.query(ProdutoModel.categoria_produto).distinct().all()]

from app.schemas.paginated import PaginatedProdutos

@router.get("/", response_model=PaginatedProdutos)
def list_produtos(
    skip: int = 0, 
    limit: int = 20, 
    q: Optional[str] = None,
    categoria: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ProdutoModel)
    if q:
        query = query.filter(ProdutoModel.nome_produto.contains(q))
    if categoria:
        query = query.filter(ProdutoModel.categoria_produto == categoria)
    
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    
    return PaginatedProdutos(
        items=items,
        total=total,
        page=skip // limit + 1,
        size=limit,
        pages=(total + limit - 1) // limit
    )

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
    last_reviews = db.query(AvaliacaoPedidoModel).join(
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
