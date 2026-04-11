from sqlalchemy import Column, String
from app.database import Base

class Consumidor(Base):
    __tablename__ = "consumidores"

    id_consumidor = Column(String, primary_key=True, index=True)
    prefixo_cep = Column(String)
    nome_consumidor = Column(String)
    cidade = Column(String)
    estado = Column(String)
