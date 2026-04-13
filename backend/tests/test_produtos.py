from app.models.produto import Produto
from app.models.categoria_imagem import CategoriaImagem

def test_create_produto(client, db):
    # Setup: Criar uma categoria primeiro (devido à FK)
    cat = CategoriaImagem(categoria="eletronicos", url_imagem="http://example.com/img.jpg")
    db.add(cat)
    db.commit()

    payload = {
        "id_produto": "test_id_123",
        "nome_produto": "Mouse Gamer",
        "categoria_produto": "eletronicos",
        "peso_produto_gramas": 150.0,
        "comprimento_centimetros": 12.0,
        "altura_centimetros": 4.0,
        "largura_centimetros": 7.0
    }
    response = client.post("/produtos/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id_produto"] == "test_id_123"
    assert data["nome_produto"] == "Mouse Gamer"

def test_list_produtos(client, db):
    # Setup: Criar produtos
    cat = CategoriaImagem(categoria="casa", url_imagem="http://example.com/casa.jpg")
    db.add(cat)
    db.add(Produto(id_produto="p1", nome_produto="Cadeira", categoria_produto="casa", peso_produto_gramas=5000, comprimento_centimetros=50, altura_centimetros=100, largura_centimetros=50))
    db.add(Produto(id_produto="p2", nome_produto="Mesa", categoria_produto="casa", peso_produto_gramas=15000, comprimento_centimetros=120, altura_centimetros=75, largura_centimetros=80))
    db.commit()

    response = client.get("/produtos/")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2

def test_get_produto_not_found(client):
    response = client.get("/produtos/non_existent_id")
    assert response.status_code == 404
    assert response.json()["detail"] == "Produto não encontrado"

def test_update_produto(client, db):
    # Setup
    cat = CategoriaImagem(categoria="utilidades", url_imagem="http://example.com/util.jpg")
    db.add(cat)
    db.add(Produto(id_produto="upd_1", nome_produto="Original", categoria_produto="utilidades", peso_produto_gramas=100, comprimento_centimetros=10, altura_centimetros=10, largura_centimetros=10))
    db.commit()

    response = client.patch("/produtos/upd_1", json={"nome_produto": "Atualizado"})
    assert response.status_code == 200
    assert response.json()["nome_produto"] == "Atualizado"
