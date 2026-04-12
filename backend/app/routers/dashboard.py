from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.pedido import Pedido
from app.models.item_pedido import ItemPedido
from app.models.consumidor import Consumidor
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

class MonthlyRevenue(BaseModel):
    month: str
    revenue: float

class DashboardStats(BaseModel):
    revenue_history: List[MonthlyRevenue]
    status_distribution: dict
    total_revenue: float
    total_orders: int
    average_ticket: float
    total_customers: int

@router.get("/", response_model=DashboardStats, summary="Obter visão geral do dashboard")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """
    Consolida as principais métricas de negócio para visualização gráfica:
    * **Histórico de Receita** dos últimos 6 meses.
    * **Distribuição de Status** de pedidos.
    * **KPIs Financeiros** (Receita total, Ticket Médio).
    * **Engajamento** (Total de clientes).
    """
    revenue_query = db.query(
        func.strftime('%Y-%m', Pedido.pedido_compra_timestamp).label('month'),
        func.sum(ItemPedido.preco_BRL).label('revenue')
    ).join(ItemPedido, Pedido.id_pedido == ItemPedido.id_pedido)\
     .group_by('month')\
     .order_by('month')\
     .limit(6).all()
    
    history = [MonthlyRevenue(month=row[0], revenue=row[1]) for row in revenue_query if row[0]]
    
    status_query = db.query(Pedido.status, func.count(Pedido.id_pedido)).group_by(Pedido.status).all()
    status_dist = {row[0]: row[1] for row in status_query}
    
    total_revenue = db.query(func.sum(ItemPedido.preco_BRL)).scalar() or 0.0
    total_orders = db.query(func.count(Pedido.id_pedido)).scalar() or 0
    total_customers = db.query(func.count(Consumidor.id_consumidor)).scalar() or 0
    average_ticket = total_revenue / total_orders if total_orders > 0 else 0.0
    
    return DashboardStats(
        revenue_history=history,
        status_distribution=status_dist,
        total_revenue=total_revenue,
        total_orders=total_orders,
        average_ticket=average_ticket,
        total_customers=total_customers
    )
