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
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Banco de Dados e Migrações:**
O projeto utiliza **Alembic** para versionamento do banco e scripts de **Seed** para popular dados reais a partir de bases CSV.

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

**Iniciando o Dashboad:**
```bash
pnpm dev
```
> Acesse a plataforma em: [http://localhost:5173](http://localhost:5173)

---

## 📡 Guia da API (FastAPI)

A API do RocketStore foi desenhada seguindo as melhores práticas REST. Abaixo, uma explicação dos métodos utilizados:

### 🔍 GET (Busca e Listagem)
*   **Finalidade:** Consultar informações existentes.
*   **Endpoints Principais:**
    *   `GET /`: Health Check para verificar se a API está online.
    *   `GET /produtos/`: Lista o catálogo com suporte a **Busca Textual** e **Paginação**.
    *   `GET /produtos/categorias`: Retorna todas as categorias únicas cadastradas para filtros no frontend.
    *   `GET /dashboard/`: Retorna KPIs globais (Receita total, histórico de 6 meses, etc).
    *   `GET /produtos/{id}/analytics`: Fornece uma análise 360º de um item específico.

### ➕ POST (Criação)
*   **Finalidade:** Registrar novos dados no sistema.
*   **Endpoint Principal:**
    *   `POST /produtos/`: Cadastra um novo produto. Requer validação de todos os campos físicos (peso, dimensões).

### 🛠️ PATCH (Atualização Parcial)
*   **Finalidade:** Editar informações de um registro sem precisar enviar o objeto completo.
*   **Endpoint Principal:**
    *   `PATCH /produtos/{id}`: Permite alterar o nome ou a categoria de um produto existente.

### 🗑️ DELETE (Remoção)
*   **Finalidade:** Excluir registros do sistema.
*   **Endpoint Principal:**
    *   `DELETE /produtos/{id}`: Remove um produto permanentemente da base.

---

## ✨ Funcionalidades em Destaque

### 📈 Smart Inventory Analytics
Diferente de um simples CRUD, o RocketStore analisa o comportamento de cada item. Ao selecionar um produto, o sistema calcula automaticamente a **Popularidade**, o **Giro de Vendas** e a **Aprovação dos Clientes** com base em dados transacionais reais.

### 🛡️ Validação Rigorosa de Dados
Implementamos verificações tanto no Frontend quanto no Backend (via Pydantic) para garantir que campos obrigatórios (nome, categoria, peso e dimensões) nunca sejam deixados vazios ou com valores inválidos (como zero ou negativos).

### 🌓 Design & UX Premium
*   **Responsive Sidebar:** Navegação inteligente adaptada para qualquer tamanho de tela.
*   **Framer Motion:** Micro-interações e animações suaves que dão vida à interface.
*   **Atomic Design:** Código organizado e modular para facilidade de manutenção.

---

## 📝 Documentação Interativa
O RocketStore utiliza o padrão **OpenAPI**. Ao acessar `/docs` no servidor do backend, você encontrará o Swagger UI completo, onde é possível testar cada endpoint diretamente pelo navegador, com exemplos de dados e descrições detalhadas de parâmetros.

---

Desevolvido pela **Equipe RocketLab** 🚀
