from app.models.pedido import Pedido
from app.models.item_pedido import ItemPedido
from app.models.consumidor import Consumidor
from datetime import datetime

def test_dashboard_summary(client, db):
    # Setup: Criar dados para o dashboard
    consumidor = Consumidor(id_consumidor="c1", prefixo_cep="12345", nome_consumidor="User 1", cidade="Curitiba", estado="PR")
    db.add(consumidor)
    
    pedido = Pedido(id_pedido="order1", id_consumidor="c1", status="entregue", pedido_compra_timestamp=datetime(2024, 1, 15))
    db.add(pedido)
    
    item = ItemPedido(id_pedido="order1", id_item=1, id_produto="prod1", id_vendedor="vend1", preco_BRL=150.0, preco_frete=20.0)
    db.add(item)
    
    db.commit()

    response = client.get("/dashboard/")
    assert response.status_code == 200
    data = response.json()
    
    assert data["total_revenue"] == 150.0
    assert data["total_orders"] == 1
    assert data["total_customers"] == 1
    assert data["average_ticket"] == 150.0
    assert len(data["revenue_history"]) > 0
    assert data["revenue_history"][0]["revenue"] == 150.0
