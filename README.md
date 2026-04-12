# 🚀 RocketStore - Intelligence E-Commerce Dashboard  

Bem-vindo ao **RocketStore**, uma plataforma de gerenciamento de e-commerce de alta performance, projetada para fornecer insights profundos sobre inventário e vendas. Este projeto utiliza o que há de mais moderno em desenvolvimento web para entregar uma experiência fluida, rápida e visualmente impactante.

---

## 🏛️ Arquitetura do Projeto

O sistema é dividido em duas frentes principais, seguindo padrões de mercado para escalabilidade:

1.  **Backend (FastAPI + SQLAlchemy):** Uma API RESTful robusta e tipada que gerencia o processamento de dados e a comunicação com o banco de dados SQLite.
2.  **Frontend (React + TypeScript):** Uma interface dinâmica construída com os princípios de **Atomic Design**, garantindo componentes reutilizáveis e uma interface de usuário consistente e premium.

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para subir o ambiente completo localmente.

### 📋 Pré-requisitos
*   **Python 3.11+**
*   **Node.js 18+**
*   **pnpm** (recomendado) ou npm/yarn.

---

### 🔧 1. Configurando o Backend (API)

Entre na pasta do backend e prepare o ambiente virtual:

```bash
cd backend
python -m venv venv
source venv/bin/activate # No Linux
venv\Scripts\activate # No Windows
pip install -r requirements.txt
```

**Banco de Dados e Migrações:**
O projeto utiliza **Alembic** para versionamento do banco e scripts de **Seed** para popular dados reais a partir de bases CSV (Olist Dataset).

```bash
# Sincroniza a estrutura do banco
alembic upgrade head

# Popula o banco com dados de exemplo (Categorias, Produtos, Pedidos e Avaliações)
python seed.py
```

**Iniciando o Servidor:**
```bash
python -m app.main
```
> Acesse a documentação técnica em: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 🎨 2. Configurando o Frontend

Em um novo terminal, entre na pasta do frontend e instale as dependências:

```bash
cd frontend
pnpm install
```

**Iniciando o Dashboard:**
```bash
pnpm dev
```
> Acesse a plataforma em: [http://localhost:5173](http://localhost:5173)

---

## 📡 Documentação Detalhada da API

Abaixo estão listados todos os endpoints disponíveis no sistema, organizados por suas funcionalidades principais.

### � Painel de Controle (Dashboard)
Analisa a saúde global do negócio em tempo real.
*   `GET /dashboard/`: Consolida métricas de receita (últimos 6 meses), distribuição de status de pedidos e KPIs como Ticket Médio.

### 📦 Catálogo de Produtos (Produtos)
Gerenciamento completo e análise individual de itens.
*   `GET /produtos/`: Lista produtos com suporte a busca textual (`q`) e paginação facilitada.
*   `GET /produtos/stats/global`: KPIs rápidos (Receita total, volume de vendas, produto mais popular).
*   `GET /produtos/categorias`: Lista todas as categorias únicas cadastradas no banco.
*   `GET /produtos/{id}`: Detalhes técnicos completos de um produto específico.
*   `POST /produtos/`: Cadastro de novos produtos com validação de dimensões.
*   `PATCH /produtos/{id}`: Edição parcial de dados do produto.
*   `DELETE /produtos/{id}`: Remoção permanente de itens do catálogo.
*   `GET /produtos/{id}/analytics`: Inteligência de produto, histórico de vendas e nota média dos consumidores.

### 👥 Gestão de Clientes (Consumidores)
Visualização da base de usuários e localização.
*   `GET /clientes/`: Listagem paginada com filtros por **Nome**, **Cidade** e **Estado**.
*   `GET /clientes/{id}`: Perfil detalhado do consumidor.

### 🏪 Parceiros de Venda (Vendedores)
Monitoramento de lojistas cadastrados.
*   `GET /vendedores/`: Lista vendedores filtrando por localização geográfica.
*   `GET /vendedores/{id}`: Detalhes do parceiro.

### 📑 Transações (Itens Pedidos)
Detalhamento de cada item transacionado na plataforma.
*   `GET /itens-pedidos/`: Histórico de vendas com filtros avançados de **Data de Início/Fim**, **Status** (bilingue) e busca por ID do pedido.
*   `GET /itens-pedidos/{id_pedido}/{id_item}/detalhes`: Visão 360º de uma transação específica (Logística, comprador e vendedor).

### 🏥 Sistema (Health)
*   `GET /`: Verifica se os serviços da API estão operacionais.

---

## ✨ Funcionalidades em Destaque

### 📈 Smart Inventory Analytics
Diferente de um simples CRUD, o RocketStore analisa o comportamento de cada item. Ao selecionar um produto, o sistema calcula automaticamente a **Popularidade**, o **Giro de Vendas** e a **Aprovação dos Clientes** com base em dados transacionais reais.

### 🛡️ Validação Rigorosa de Dados
Nenhum dado entra "sujo" no sistema. Implementamos verificações via **Pydantic** no Backend e validações dinâmicas no Frontend para garantir que campos obrigatórios (nome, categoria, peso e dimensões) sejam sempre válidos e positivos.

### 🌓 Design & UX Premium
*   **Responsive Sidebar:** Navegação inteligente adaptada para qualquer tamanho de tela.
*   **Framer Motion:** Micro-interações e animações suaves que dão vida à interface.
*   **Atomic Design:** Código organizado e modular para facilidade de manutenção.

---

## 📝 Documentação Swagger
O RocketStore utiliza o padrão **OpenAPI**. Ao acessar `/docs` no servidor do backend, você encontrará o Swagger UI interativo, onde é possível testar cada endpoint diretamente pelo navegador.

---

Desenvolvido por **Matheus Velame** 🚀
