from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.produto import Produto
from app.models.categoria_imagem import CategoriaImagem

def test_list_itens_pedidos(client, db):
    cat = CategoriaImagem(categoria="eletronicos", url_imagem="http://img.com")
    db.add(cat)
    prod = Produto(id_produto="p1", nome_produto="Mouse", categoria_produto="eletronicos", peso_produto_gramas=100, comprimento_centimetros=10, altura_centimetros=5, largura_centimetros=5)
    db.add(prod)
    ped = Pedido(id_pedido="o1", id_consumidor="c1", status="entregue")
    db.add(ped)
    item = ItemPedido(id_pedido="o1", id_item=1, id_produto="p1", id_vendedor="v1", preco_BRL=100.0, preco_frete=10.0)
    db.add(item)
    db.commit()

    response = client.get("/itens-pedidos/")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["nome_produto"] == "Mouse"
    assert data["items"][0]["status_pedido"] == "entregue"

def test_filter_itens_pedidos_by_status(client, db):
    cat = CategoriaImagem(categoria="eletronicos", url_imagem="http://img.com")
    db.add(cat)
    prod = Produto(id_produto="p1", nome_produto="Mouse", categoria_produto="eletronicos", peso_produto_gramas=100, comprimento_centimetros=10, altura_centimetros=5, largura_centimetros=5)
    db.add(prod)
    db.add(Pedido(id_pedido="o1", id_consumidor="c1", status="delivered"))
    db.add(ItemPedido(id_pedido="o1", id_item=1, id_produto="p1", id_vendedor="v1", preco_BRL=100.0, preco_frete=10.0))
    db.commit()

    response = client.get("/itens-pedidos/?status=entregue")
    assert response.status_code == 200
    assert response.json()["total"] == 1

def test_item_detalhes_not_found(client):
    response = client.get("/itens-pedidos/invalid/1/detalhes")
    assert response.status_code == 404
