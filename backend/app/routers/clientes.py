from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.consumidor import Consumidor as ConsumidorModel
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/clientes", tags=["Consumidores"])

class ConsumidorSchema(BaseModel):
    id_consumidor: str
    prefixo_cep: Optional[str] = None
    nome_consumidor: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None

    class Config:
        from_attributes = True

class PaginatedClientes(BaseModel):
    items: List[ConsumidorSchema]
    total: int
    page: int
    pages: int

@router.get("/", response_model=PaginatedClientes, summary="Listar consumidores cadastrados")
def list_clientes(
    skip: int = Query(0, description="Número de itens para pular (offset)"), 
    limit: int = Query(20, description="Quantidade máxima de itens por página"), 
    q: Optional[str] = Query(None, description="Busca por nome do consumidor"),
    estado: Optional[str] = Query(None, description="Filtro por sigla do estado (ex: SP)"),
    cidade: Optional[str] = Query(None, description="Filtro por nome da cidade"),
    db: Session = Depends(get_db)
):
    """
    Retorna uma lista paginada de consumidores com filtros geográficos e de busca nominal.
    """
    query = db.query(ConsumidorModel)
    if q:
        query = query.filter(ConsumidorModel.nome_consumidor.contains(q))
    if estado:
        query = query.filter(ConsumidorModel.estado.ilike(f"%{estado}%"))
    if cidade:
        query = query.filter(ConsumidorModel.cidade.ilike(f"%{cidade}%"))
    
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    
    return PaginatedClientes(
        items=items,
        total=total,
        page=skip // limit + 1,
        pages=(total + limit - 1) // limit
    )
@router.get("/{id_consumidor}", response_model=ConsumidorSchema, summary="Obter dados de um consumidor específico")
def get_cliente(
    id_consumidor: str = Path(..., description="ID único do consumidor"), 
    db: Session = Depends(get_db)
):
    cliente = db.query(ConsumidorModel).filter(ConsumidorModel.id_consumidor == id_consumidor).first()
    if not cliente:
        return {"id_consumidor": id_consumidor, "nome_consumidor": "Não encontrado", "cidade": "-", "estado": "-"}
    return cliente
