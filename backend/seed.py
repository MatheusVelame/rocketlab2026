import pandas as pd
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Consumidor, Produto, Vendedor, Pedido, ItemPedido, AvaliacaoPedido, CategoriaImagem
from datetime import datetime

def parse_date(date_str):
    """Converte strings de data do CSV para objetos datetime do Python."""
    if pd.isna(date_str) or date_str == "" or date_str == "Sem comentário":
        return None
    try:
        return datetime.strptime(str(date_str), '%Y-%m-%d %H:%M:%S')
    except ValueError:
        try:
            return datetime.strptime(str(date_str), '%Y-%m-%d')
        except ValueError:
            return None

def seed_database():
    db: Session = SessionLocal()
    from app.database import engine, Base
    Base.metadata.create_all(engine)
    print("Iniciando a população do banco de dados...")

    try:
        print("Populando Categorias de Imagens...")
        df_img = pd.read_csv("data/dim_categoria_imagens.csv")
        for _, row in df_img.iterrows():
            db.add(CategoriaImagem(
                categoria=row['Categoria'],
                url_imagem=row['Link']
            ))
        db.commit()

        print("Populando Consumidores...")
        df_cons = pd.read_csv("data/dim_consumidores.csv")
        for _, row in df_cons.iterrows():
            db.add(Consumidor(
                id_consumidor=row['id_consumidor'],
                prefixo_cep=str(row['prefixo_cep']),
                nome_consumidor=row['nome_consumidor'],
                cidade=row['cidade'],
                estado=row['estado']
            ))

        print("Populando Vendedores...")
        df_vend = pd.read_csv("data/dim_vendedores.csv")
        for _, row in df_vend.iterrows():
            db.add(Vendedor(
                id_vendedor=row['id_vendedor'],
                nome_vendedor=row['nome_vendedor'],
                prefixo_cep=str(row['prefixo_cep']),
                cidade=row['cidade'],
                estado=row['estado']
            ))

        print("Populando Produtos...")
        df_prod = pd.read_csv("data/dim_produtos.csv")
        # Preenche categorias vazias para evitar erro de NOT NULL constraint
        df_prod['categoria_produto'] = df_prod['categoria_produto'].fillna("Outros")
        
        for _, row in df_prod.iterrows():
            db.add(Produto(
                id_produto=row['id_produto'],
                nome_produto=row['nome_produto'],
                categoria_produto=row['categoria_produto'],
                peso_produto_gramas=None if pd.isna(row['peso_produto_gramas']) else float(row['peso_produto_gramas']),
                comprimento_centimetros=None if pd.isna(row['comprimento_centimetros']) else float(row['comprimento_centimetros']),
                altura_centimetros=None if pd.isna(row['altura_centimetros']) else float(row['altura_centimetros']),
                largura_centimetros=None if pd.isna(row['largura_centimetros']) else float(row['largura_centimetros'])
            ))

        print("Populando Pedidos...")
        df_ped = pd.read_csv("data/fat_pedidos.csv")
        for _, row in df_ped.iterrows():
            db.add(Pedido(
                id_pedido=row['id_pedido'],
                id_consumidor=row['id_consumidor'],
                status=row['status'],
                pedido_compra_timestamp=parse_date(row['pedido_compra_timestamp']),
                pedido_entregue_timestamp=parse_date(row['pedido_entregue_timestamp']),
                data_estimada_entrega=parse_date(row['data_estimada_entrega']),
                tempo_entrega_dias=None if pd.isna(row['tempo_entrega_dias']) else float(row['tempo_entrega_dias']),
                tempo_entrega_estimado_dias=None if pd.isna(row['tempo_entrega_estimado_dias']) else float(row['tempo_entrega_estimado_dias']),
                diferenca_entrega_dias=None if pd.isna(row['diferenca_entrega_dias']) else float(row['diferenca_entrega_dias']),
                entrega_no_prazo=row['entrega_no_prazo']
            ))

        db.commit()

        print("Populando Itens dos Pedidos...")
        df_itens = pd.read_csv("data/fat_itens_pedidos.csv")
        for _, row in df_itens.iterrows():
            db.add(ItemPedido(
                id_pedido=row['id_pedido'],
                id_item=int(row['id_item']),
                id_produto=row['id_produto'],
                id_vendedor=row['id_vendedor'],
                preco_BRL=float(row['preco_BRL']),
                preco_frete=float(row['preco_frete'])
            ))

        print("Populando Avaliações...")
        df_aval = pd.read_csv("data/fat_avaliacoes_pedidos.csv")
        
        df_aval = df_aval.drop_duplicates(subset=['id_avaliacao'])
        
        for _, row in df_aval.iterrows():
            db.add(AvaliacaoPedido(
                id_avaliacao=row['id_avaliacao'],
                id_pedido=row['id_pedido'],
                avaliacao=int(row['avaliacao']),
                titulo_comentario=str(row['titulo_comentario']) if not pd.isna(row['titulo_comentario']) else None,
                comentario=str(row['comentario']) if not pd.isna(row['comentario']) else None,
                data_comentario=parse_date(row['data_comentario']),
                data_resposta=parse_date(row['data_resposta'])
            ))

        db.commit()
        print("Sucesso! Banco de dados populado com todos os registros.")

    except Exception as e:
        print(f"Erro ao popular o banco: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()