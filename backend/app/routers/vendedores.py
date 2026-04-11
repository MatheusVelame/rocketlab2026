from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.vendedor import Vendedor as VendedorModel
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/vendedores", tags=["vendedores"])

class VendedorSchema(BaseModel):
    id_vendedor: str
    nome_vendedor: Optional[str] = None
    prefixo_cep: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None

    class Config:
        from_attributes = True

class PaginatedVendedores(BaseModel):
    items: List[VendedorSchema]
    total: int
    page: int
    pages: int

@router.get("/", response_model=PaginatedVendedores)
def list_vendedores(
    skip: int = 0, 
    limit: int = 20, 
    q: Optional[str] = None,
    estado: Optional[str] = None,
    cidade: Optional[str] = None,
    db: Session = Depends(get_db)
):
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

@router.get("/{id_vendedor}", response_model=VendedorSchema)
def get_vendedor(id_vendedor: str, db: Session = Depends(get_db)):
    vendedor = db.query(VendedorModel).filter(VendedorModel.id_vendedor == id_vendedor).first()
    if not vendedor:
        return {"id_vendedor": id_vendedor, "nome_vendedor": "Não encontrado", "cidade": "-", "estado": "-"}
    return vendedor
