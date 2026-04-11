from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.consumidor import Consumidor as ConsumidorModel
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/clientes", tags=["clientes"])

class ConsumidorSchema(BaseModel):
    id_consumidor: str
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

@router.get("/", response_model=PaginatedClientes)
def list_clientes(
    skip: int = 0, 
    limit: int = 20, 
    q: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ConsumidorModel)
    if q:
        query = query.filter(ConsumidorModel.nome_consumidor.contains(q))
    
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    
    return PaginatedClientes(
        items=items,
        total=total,
        page=skip // limit + 1,
        pages=(total + limit - 1) // limit
    )
@router.get("/{id_consumidor}", response_model=ConsumidorSchema)
def get_cliente(id_consumidor: str, db: Session = Depends(get_db)):
    cliente = db.query(ConsumidorModel).filter(ConsumidorModel.id_consumidor == id_consumidor).first()
    if not cliente:
        return {"id_consumidor": id_consumidor, "nome_consumidor": "Não encontrado", "cidade": "-", "estado": "-"}
    return cliente
