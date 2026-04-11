from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import produtos, clientes, dashboard, vendedores, itens_pedidos

app = FastAPI(
    title="Sistema de Gerenciamento de E-Commerce",
    description="API para gerenciamento de pedidos, produtos, consumidores e vendedores.",
    version="1.0.0",
)

# Configuração de CORS para permitir requisições do Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(produtos.router)
app.include_router(clientes.router)
app.include_router(vendedores.router)
app.include_router(itens_pedidos.router)
app.include_router(dashboard.router)

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "API rodando com sucesso!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
