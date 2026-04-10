from pydantic import BaseModel, ConfigDict
from typing import Optional

class ProdutoBase(BaseModel):
    nome_produto: str
    categoria_produto: str
    url_imagem: Optional[str] = None
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None

class ProdutoCreate(ProdutoBase):
    id_produto: str

class ProdutoUpdate(BaseModel):
    nome_produto: Optional[str] = None
    categoria_produto: Optional[str] = None
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None

class Produto(ProdutoBase):
    id_produto: str
    
    model_config = ConfigDict(from_attributes=True)
