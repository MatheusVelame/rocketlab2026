from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import produtos, clientes, dashboard, vendedores, itens_pedidos

tags_metadata = [
    {
        "name": "Dashboard",
        "description": "Estatísticas agregadas e KPIs para a visão geral do negócio.",
    },
    {
        "name": "Produtos",
        "description": "Gerenciamento completo do catálogo de produtos e analytics individual.",
    },
    {
        "name": "Consumidores",
        "description": "Gestão e localização de clientes da plataforma.",
    },
    {
        "name": "Vendedores",
        "description": "Administração de parceiros e lojistas.",
    },
    {
        "name": "Itens Pedidos",
        "description": "Detalhes técnicos de transações e logs de itens vendidos.",
    },
]

app = FastAPI(
    title="RocketStore API - Sistema de Gerenciamento 🚀",
    description="""
API robusta para um sistema completo de e-commerce.

Permite:
* **Gerenciar Inventário** (CRUD de produtos).
* **Analisar Desempenho** (Analytics detalhado e KPIs de vendas).
* **Monitorar Operações** (Pedidos, clientes e logística).
* **Consultar Dados Geográficos** (Localização de clientes e vendedores).
""",
    version="1.0.0",
    openapi_tags=tags_metadata,
    contact={
        "name": "Equipe de Desenvolvimento RocketLab",
        "url": "http://localhost:5173",
    },
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(produtos.router)
app.include_router(clientes.router)
app.include_router(vendedores.router)
app.include_router(itens_pedidos.router)

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "API rodando com sucesso!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
