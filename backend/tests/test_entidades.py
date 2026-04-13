from app.models.consumidor import Consumidor
from app.models.vendedor import Vendedor

def test_list_clientes(client, db):
    db.add(Consumidor(id_consumidor="c1", nome_consumidor="Alice", prefixo_cep="12345", cidade="Sao Paulo", estado="SP"))
    db.add(Consumidor(id_consumidor="c2", nome_consumidor="Bob", prefixo_cep="54321", cidade="Rio", estado="RJ"))
    db.commit()

    response = client.get("/clientes/")
    assert response.status_code == 200
    assert response.json()["total"] == 2
    assert response.json()["items"][0]["nome_consumidor"] == "Alice"

def test_filter_clientes_by_state(client, db):
    db.add(Consumidor(id_consumidor="c1", nome_consumidor="Alice", prefixo_cep="12345", cidade="Sao Paulo", estado="SP"))
    db.add(Consumidor(id_consumidor="c2", nome_consumidor="Bob", prefixo_cep="54321", cidade="Rio", estado="RJ"))
    db.commit()

    response = client.get("/clientes/?estado=SP")
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["nome_consumidor"] == "Alice"

def test_list_vendedores(client, db):
    db.add(Vendedor(id_vendedor="v1", nome_vendedor="Loja A", prefixo_cep="99999", cidade="Curitiba", estado="PR"))
    db.commit()

    response = client.get("/vendedores/")
    assert response.status_code == 200
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["nome_vendedor"] == "Loja A"

def test_get_vendedor_not_found(client):
    response = client.get("/vendedores/wrong_id")
    # Nota: No seu router, voce retorna um dicionario com "Não encontrado" em vez de 404
    assert response.status_code == 200
    assert response.json()["nome_vendedor"] == "Não encontrado"

