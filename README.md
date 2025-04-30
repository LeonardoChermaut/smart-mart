# SmartMart Solutions

Aplicacao **Fullstack** para controle de produtos, vendas e categorias, com dashboard analítico.
Desenvolvido com **Python (FastAPI)** no backend e **React + Vite + TailwindCSS** no frontend.

---

## Estrutura de Pastas

```plaintext
smart-mart/
├── app/
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

### Requisitos

- Node.js
- Yarn instalado globalmente
- Python
- pip instalado

---

### Executando a partir da raiz com concurrency (RECOMENDADO + RÁPIDO)

Você pode rodar o backend e frontend simultaneamente utilizando na pasta raiz `smart-mart`

```bash
# Instalar dependências de frontend e backend
yarn install:all
ou
npm install:all

# Após a instalação
yarn start
ou
npm start
```

Isso iniciará tanto o **backend** quanto o **frontend** em paralelo.

---

### Manualmente

#### Backend

1. Entrar na pasta backend:

```bash
cd app/backend
```

2. Instalar dependências Python (caso use virtualenv):

```bash
pip install -r requirements.txt
```

3. Rodar o servidor backend na pasta raiz `smart-mart`

```bash
uvicorn app.backend.main:app --reload
```

#### Frontend

1. Navegar para a pasta frontend:

```bash
cd app/frontend
```

2. Instalar dependências:

```bash
yarn install
```

3. Rodar o servidor de desenvolvimento:

```bash
yarn dev
```

---

## Utilização

1. Seguir hierarquia de criação dos dados:

```bash
1ª Categories, 2ª Products, 3ª Sales.
```

2. Arquivos prontos disponíveis em:

```bash
smart-mart/app/shared/files
```

3. Popular o banco manualmente:

```bash
Copiar o arquivo .db de exemplo
De: smart-mart/app/shared/files/database.db
Para: smart-mart/app/backend/database/database.db
```

---

## Funcionalidades Implementadas

- Endpoint POST para inserir novos produtos
- Endpoint GET para listar produtos e vendas, incluindo o lucro
- Endpoint GET para listar categorias
- Endpoint POST para importar produtos, vendas e categorias via arquivo CSV
- Dashboard com dois gráficos (Quantidade de Vendas e Lucro de Vendas)
- Formulário para cadastro de produtos
- Upload de arquivos CSV para importar novos produtos
- Filtros por categoria de produto

---

## Extras Implementados

- Filtro dinâmico por **ano** no Dashboard
- Edição inline de valores de vendas e lucro por mês
- Inserção de novas categorias via formulário
- Possibilidade de editar quantidade e preço por mês

### Extras Plus ++

- Cache de dados no frontend utilizando **React Query**
- Importação de **.csv** para produtos, categorias e vendas
- Build e Start project com concurrency
- Visual hieráquica clara
- Exportação dos dados de **SaleAnalytics** para arquivo Excel formatado
