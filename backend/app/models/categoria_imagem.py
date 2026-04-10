from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class CategoriaImagem(Base):
    __tablename__ = "categorias_imagens"

    categoria: Mapped[str] = mapped_column(String(100), primary_key=True)
    url_imagem: Mapped[str] = mapped_column(String(500))
