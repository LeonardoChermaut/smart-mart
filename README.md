# SmartMart Solutions

Aplicação **Fullstack** para controle de produtos, vendas e categorias, com dashboard analítico.
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
│   ├── shared/
│   └── files/
│       ├── products.csv
│       ├── categories.csv
│       ├── database.db
│       └── sales.csv
```

---

## Requisitos

- **Python 3.12+**
- **Node.js 18+**
- **Yarn** ou **NPM** instalado globalmente na pasta raiz smart-mart.
- **pip** instalado (para dependências Python)

---

## Instalação (RECOMENDADO)

### 1. Clonar o repositório e navegar para a raiz do projeto:

```bash
cd smart-mart
```

### 2. Instalar dependências da raiz:

```bash
yarn install
# ou
npm install
```

### 3. Instalar dependências internas (backend e frontend) da pasta raiz smart-mart.

```bash
yarn install:all
# ou
npm install:all
```

### 4. Renomear o arquivo `.env.example` para `.env` no frontend

```bash
cd app/frontend
# depois
mv .env.example .env
# ou alterar manualmente
```

### 5. Iniciar a aplicação (frontend + backend em paralelo) da pasta raiz smart-mart.

```bash
yarn start
# ou
npm start
```

---

### Execução Manual

#### Backend

```bash
cd app/backend
pip install -r requirements.txt
cd ../../
#dentro da pasta raiz smart-mart ↓
uvicorn app.backend.main:app --reload
```

#### Frontend

```bash
cd app/frontend
yarn install
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
- Filtro no frontend pra products com componentes modulares
- Edição inline de valores de vendas e lucro por mês
- Inserção de novas categorias via formulário
- Possibilidade de editar quantidade e preço por mês

### Extras Plus ++

- Cache de dados no frontend utilizando **React Query**
- Importação de **.csv** para produtos, categorias e vendas
- Build e Start project com concurrency
- Visual hieráquica clara
- Exportação dos dados de **SaleAnalytics** para arquivo Excel formatado
