from fastapi import APIRouter, Depends, HTTPException, Query, Path
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

@router.get("/stats/global", response_model=GlobalStats, summary="Obter KPIs globais do e-commerce")
def get_global_stats(db: Session = Depends(get_db)):
    """
    Retorna estatísticas agregadas de alto nível, incluindo:
    * **Receita Total**
    * **Volume de Vendas**
    * **Ticket Médio**
    * **Categoria mais popular**
    """
    total_receita = db.query(func.sum(ItemPedidoModel.preco_BRL)).scalar() or 0.0
    total_vendas = db.query(func.count(ItemPedidoModel.id_item)).scalar() or 0
    total_produtos = db.query(func.count(ProdutoModel.id_produto)).scalar() or 0
    
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

@router.get("/categorias", response_model=List[str], summary="Listar todas as categorias disponíveis")
def list_categorias(db: Session = Depends(get_db)):
    """
    Retorna uma lista única de todas as categorias de produtos presentes no banco de dados.
    """
    return [c[0] for c in db.query(ProdutoModel.categoria_produto).distinct().all()]

from app.schemas.paginated import PaginatedProdutos

@router.get("/", response_model=PaginatedProdutos, summary="Listar produtos com paginação e busca")
def list_produtos(
    skip: int = Query(0, description="Número de itens para pular (offset)"), 
    limit: int = Query(20, description="Quantidade máxima de itens por página"), 
    q: Optional[str] = Query(None, description="Busca por nome do produto (busca parcial)"),
    categoria: Optional[str] = Query(None, description="Filtro exato por categoria"),
    db: Session = Depends(get_db)
):
    """
    Lista os produtos cadastrados com suporte a:
    * **Busca textual** via parâmetro `q`.
    * **Filtragem por categoria**.
    * **Paginação eficiente** usando `skip` e `limit`.
    """
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

@router.get("/{id_produto}", response_model=Produto, summary="Obter detalhes de um produto específico")
def get_produto(
    id_produto: str = Path(..., description="ID único do produto (ex: c777355d18b72b67da6d2a9628a99c71)"), 
    db: Session = Depends(get_db)
):
    db_produto = db.query(ProdutoModel).filter(ProdutoModel.id_produto == id_produto).first()
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return db_produto

@router.patch("/{id_produto}", response_model=Produto, summary="Atualizar informações de um produto")
def update_produto(
    id_produto: str = Path(..., description="ID do produto a ser editado"), 
    produto_update: ProdutoUpdate = None, 
    db: Session = Depends(get_db)
):
    """
    Atualiza campos parciais de um produto. 
    Ex: Alterar apenas o nome ou apenas a categoria.
    """
    db_produto = db.query(ProdutoModel).filter(ProdutoModel.id_produto == id_produto).first()
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    update_data = produto_update.model_dump(exclude_unset=True, exclude={"url_imagem"})
    for key, value in update_data.items():
        setattr(db_produto, key, value)
    
    db.commit()
    db.refresh(db_produto)
    return db_produto

@router.post("/", response_model=Produto, status_code=201, summary="Cadastrar um novo produto")
def create_produto(produto: Produto, db: Session = Depends(get_db)):
    """
    Cria um novo registro de produto no catálogo.
    """
    db_exists = db.query(ProdutoModel).filter(ProdutoModel.id_produto == produto.id_produto).first()
    if db_exists:
        raise HTTPException(status_code=400, detail="ID de produto já cadastrado")
    
    new_product = ProdutoModel(**produto.model_dump(exclude={"url_imagem"}))
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.delete("/{id_produto}", status_code=204, summary="Remover um produto do sistema")
def delete_produto(
    id_produto: str = Path(..., description="ID do produto a ser excluído"), 
    db: Session = Depends(get_db)
):
    db_produto = db.query(ProdutoModel).filter(ProdutoModel.id_produto == id_produto).first()
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    db.delete(db_produto)
    db.commit()
    return None

@router.get("/{id_produto}/analytics", response_model=ProductAnalytics, summary="Obter performance detalhada do produto")
def get_produto_analytics(
    id_produto: str = Path(..., description="ID do produto para análise de vendas"), 
    db: Session = Depends(get_db)
):
    """
    Retorna métricas de performance específicas de um produto:
    * **Histórico de vendas** (total e receita).
    * **Avaliação média** dos consumidores.
    * **Últimos comentários** recebidos.
    """
    db_produto = db.query(ProdutoModel).filter(ProdutoModel.id_produto == id_produto).first()
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    sales_data = db.query(
        func.count(ItemPedidoModel.id_item).label("total_vendas"),
        func.sum(ItemPedidoModel.preco_BRL).label("receita_total"),
        func.avg(ItemPedidoModel.preco_BRL).label("preco_medio")
    ).filter(ItemPedidoModel.id_produto == id_produto).first()

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

    last_reviews = db.query(AvaliacaoPedidoModel).join(
        ItemPedidoModel, ItemPedidoModel.id_pedido == AvaliacaoPedidoModel.id_pedido
    ).filter(
        ItemPedidoModel.id_produto == id_produto
    ).order_by(
        AvaliacaoPedidoModel.data_comentario.desc()
    ).all()

    return ProductAnalytics(
        id_produto=db_produto.id_produto,
        nome_produto=db_produto.nome_produto,
        performance=performance,
        ultimas_avaliacoes=last_reviews
    )
