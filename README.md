# SmartMart Solutions

Aplicação **Fullstack** para controle de produtos, vendas e categorias, com dashboard analítico.
Desenvolvido com **Python (FastAPI)** no backend e **React + Vite + TailwindCSS** no frontend.

---

## Estrutura de Pastas

```plaintext
smart-mart/
├── apps/
│   ├── backend/
│   │   ├── models/
│   │   │   ├── categories.py
│   │   │   ├── products.py
│   │   │   └── sales.py
│   │   ├── schemas/
│   │   │   ├── categories.py
│   │   │   ├── products.py
│   │   │   └── sales.py
│   │   ├── service/
│   │   │   ├── categories.py
│   │   │   ├── products.py
│   │   │   └── sales.py
│   │   ├── routers/
│   │   │   ├── categories.py
│   │   │   ├── products.py
│   │   │   └── sales.py
│   │   ├── database/
│   │   │   ├── database.py
│   │   │   └── database.db
│   │── Dockerfile.backend
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── modules/
│   │   │   │   ├── products/
│   │   │   │   ├── categories/
│   │   │   │   ├── sales/
│   │   │   │   ├── dashboard/
│   │   │   │   └── home/
│   │   │   ├── shared/
│   │   │   │   ├── utils/
│   │   │   │   ├── hook/
│   │   │   │   ├── interface/
│   │   │   │   ├── service/
│   │   │   │   └── query/
│   │   │── Dockerfile.frontend
│   ├── shared/
│   └── files/
│      ├── products.csv,
│      ├── categories.csv,
│      ├── sales.csv,
```

---

## Como Rodar o Projeto

### Executando a partir da raiz com concurrency (recomendado + rápido)

Você pode rodar o backend e frontend simultaneamente utilizando o `yarn install:all` para concorrência.

Na raiz do projeto, execute:

```bash
yarn start
```

Isso iniciará tanto o **backend** quanto o **frontend** em paralelo.

### Com Docker (recomendado + seguro)

Na raiz do projeto `smart-mart`, execute:

```bash
docker compose up --build
```

Esse comando irá subir os containers do frontend e backend automaticamente.

---

### Manualmente (sem Docker)

#### Backend

No Windows, na raiz do projeto `smart-mart`, execute:

```bash
uvicorn app.backend.main:app --reload
```

#### Frontend

1. Navegar para a pasta frontend:

```bash
cd apps/frontend
```

2. Instalar dependências:

```bash
yarn install
```

3. Rodar o servidor de desenvolvimento:

```bash
yarn dev
```

4. Testar a importação com os arquivos prontos

```bash
smart-mart/app/shared/files
```

## Funcionalidades Implementadas

### Backend

- Endpoint POST para inserir novos produtos
- Endpoint GET para listar produtos e vendas, incluindo o lucro
- Endpoint GET para listar categorias
- Endpoint POST para importar produtos, vendas e categorias via arquivo CSV

### Frontend

- Dashboard com dois gráficos (Quantidade de Vendas e Lucro de Vendas)
- Formulário para cadastro de produtos
- Upload de arquivos CSV para importar novos produtos
- Filtros por categoria de produto

## Extras Implementados

- Filtro dinâmico por **ano** no Dashboard
- Edição inline de valores de vendas e lucro por mês
- Inserção de novas categorias via formulário
- Possibilidade de editar quantidade e preço por mês

---

### Extras Plus ++

- Cache de dados no frontend utilizando **React Query**
- Importação de **.csv** para produtos, categorias e vendas
- Build e Start project com concurrency
- Build com Docker conteinerização
- Visual hieraquica clara
- Exportação dos dados de **SaleAnalytics** para arquivo Excel formatado

---

## Exemplo de Dados (JSON)

### SaleAnalytics

```json
[
  {
    "month": "2025-01",
    "total_sales": 0,
    "quantity": 0,
    "profit_or_loss": 0
  }
]
```

### Products

```json
[
  {
    "id": 1,
    "name": "iPhone 15",
    "category_id": 1,
    "base_price": 1200,
    "current_price": 1300
  }
]
```

### Sales

```json
[
  {
    "id": 1,
    "product_id": 1,
    "date": "2025-01-05",
    "quantity": 2,
    "total_price": 2200
  }
]
```

### Categories

```json
[
  {
    "id": 1,
    "name": "Smartphones",
    "discount_percent": 5
  }
]
```
