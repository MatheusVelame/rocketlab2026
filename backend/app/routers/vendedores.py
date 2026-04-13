from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.vendedor import Vendedor as VendedorModel
from pydantic import BaseModel, ConfigDict
from typing import List, Optional

router = APIRouter(prefix="/vendedores", tags=["Vendedores"])

class VendedorSchema(BaseModel):
    id_vendedor: str
    nome_vendedor: Optional[str] = None
    prefixo_cep: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PaginatedVendedores(BaseModel):
    items: List[VendedorSchema]
    total: int
    page: int
    pages: int

@router.get("/", response_model=PaginatedVendedores, summary="Listar vendedores parceiros")
def list_vendedores(
    skip: int = Query(0, description="Número de itens para pular (offset)"), 
    limit: int = Query(20, description="Quantidade máxima de itens por página"), 
    q: Optional[str] = Query(None, description="Busca por nome do vendedor"),
    estado: Optional[str] = Query(None, description="Filtro por sigla do estado"),
    cidade: Optional[str] = Query(None, description="Filtro por cidade"),
    db: Session = Depends(get_db)
):
    """
    Retorna uma lista paginada de vendedores registrados no sistema.
    """
    query = db.query(VendedorModel)
    if q:
        query = query.filter(VendedorModel.nome_vendedor.contains(q))
    if estado:
        query = query.filter(VendedorModel.estado.ilike(f"%{estado}%"))
    if cidade:
        query = query.filter(VendedorModel.cidade.ilike(f"%{cidade}%"))
    
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    
    return PaginatedVendedores(
        items=items,
        total=total,
        page=skip // limit + 1,
        pages=(total + limit - 1) // limit
    )

@router.get("/{id_vendedor}", response_model=VendedorSchema, summary="Obter detalhes de um vendedor")
def get_vendedor(
    id_vendedor: str = Path(..., description="ID único do vendedor"), 
    db: Session = Depends(get_db)
):
    vendedor = db.query(VendedorModel).filter(VendedorModel.id_vendedor == id_vendedor).first()
    if not vendedor:
        return {"id_vendedor": id_vendedor, "nome_vendedor": "Não encontrado", "cidade": "-", "estado": "-"}
    return vendedor
