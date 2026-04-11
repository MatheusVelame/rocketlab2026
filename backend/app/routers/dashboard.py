from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.pedido import Pedido
from app.models.item_pedido import ItemPedido
from sqlalchemy import func
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

class MonthlyRevenue(BaseModel):
    month: str
    revenue: float

class DashboardStats(BaseModel):
    revenue_history: List[MonthlyRevenue]
    status_distribution: dict

@router.get("/", response_model=DashboardStats)
def get_dashboard_summary(db: Session = Depends(get_db)):
    # 1. Receita por Mês (Simulado ou Real se houver dados consistentes)
    # Vamos pegar os últimos 6 meses de pedidos
    revenue_query = db.query(
        func.strftime('%Y-%m', Pedido.pedido_compra_timestamp).label('month'),
        func.sum(ItemPedido.preco_BRL).label('revenue')
    ).join(ItemPedido, Pedido.id_pedido == ItemPedido.id_pedido)\
     .group_by('month')\
     .order_by('month')\
     .limit(6).all()
    
    history = [MonthlyRevenue(month=row[0], revenue=row[1]) for row in revenue_query if row[0]]
    
    # 2. Distribuição de Status
    status_query = db.query(Pedido.status, func.count(Pedido.id_pedido)).group_by(Pedido.status).all()
    status_dist = {row[0]: row[1] for row in status_query}
    
    return DashboardStats(
        revenue_history=history,
        status_distribution=status_dist
    )
