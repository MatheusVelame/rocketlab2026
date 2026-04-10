# RocketStore - Sistema de Gerenciamento de E-Commerce

Este é um sistema completo de gerenciamento para gerentes de e-commerce, permitindo a visualização da lista de produtos, análise de desempenho de vendas, avaliações dos consumidores e modificação de informações dos produtos.

## 🛠️ Stack Tecnológica

- **Frontend**: Vite + React + TypeScript + Framer Motion + Lucide React
- **Backend**: FastAPI (Python) + SQLAlchemy 2.0
- **Banco de Dados**: SQLite
- **Gerenciador de Pacotes**: pnpm (Frontend) / pip (Backend)

---

## 🚀 Como Executar o Projeto

### 1. Requisitos Prévios
- Node.js e **pnpm** instalados.
- Python 3.11+ instalado.

### 2. Configuração do Backend
Entre na pasta `backend`:
```bash
cd backend
```

Crie um ambiente virtual e instale as dependências:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate no Windows

pip install -r requirements.txt
```

Configure o banco de dados e as migrações:
```bash
# Aplica as migrações
alembic upgrade head

# Popula o banco com dados iniciais (CSV)
python seed.py
```

Inicie o servidor da API:
```bash
python -m app.main
```
A API estará em: [http://localhost:8000](http://localhost:8000)
Documentação Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Configuração do Frontend
Em um novo terminal, entre na pasta `frontend`:
```bash
cd frontend
```

Instale as dependências com **pnpm**:
```bash
pnpm install
```

Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```
O frontend estará em: [http://localhost:5173](http://localhost:5173)

---

## ✨ Funcionalidades Principais
- **Listagem de Produtos**: Visualização rápida de todos os produtos do inventário.
- **Busca em Tempo Real**: Filtro instantâneo por nome de produto.
- **Analytics de Desempenho**: Ao clicar em um produto, veja o total de vendas, receita gerada e avaliação média.
- **Edição de Informações**: Modifique nome e categoria dos produtos diretamente no painel.
- **Design Premium**: Interface responsiva e animada com modo escuro nativo.

## 📝 Documentação Interativa (Swagger)
A API utiliza o FastAPI para gerar documentação automática. Ao rodar o backend, acesse `/docs` para testar todos os endpoints interativamente.
