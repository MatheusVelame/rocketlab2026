from typing import Optional

from sqlalchemy import String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Produto(Base):
    __tablename__ = "produtos"

    id_produto: Mapped[str] = mapped_column(String(32), primary_key=True)
    nome_produto: Mapped[str] = mapped_column(String(255))
    categoria_produto: Mapped[str] = mapped_column(
        String(100), ForeignKey("categorias_imagens.categoria")
    )
    peso_produto_gramas: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    comprimento_centimetros: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    altura_centimetros: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    largura_centimetros: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    # Relacionamento para pegar a imagem
    imagem: Mapped[Optional["CategoriaImagem"]] = relationship(lazy="joined")

    @property
    def url_imagem(self) -> Optional[str]:
        return self.imagem.url_imagem if self.imagem else None

