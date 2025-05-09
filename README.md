# SmartMart Solutions

Aplicação **Fullstack** para controle de produtos, vendas e categorias, com dashboard analítico.
Desenvolvido com **Python (FastAPI)** no backend e **React + Vite + TailwindCSS** no frontend.

---

## ⚠️ Observações Importantes

- **Backend já está em produção**: Então não é necessário subir o backend. O deploy foi realizado no Render, pronto para conexão com o frontend
- **Dados iniciais**: Arquivos CSV estão disponíveis em `smart-mart/app/shared/files/` para importação seguir ordem:
  - 1ª `categories.csv` - Categorias disponíveis
  - 2ª `products.csv` - Lista de produtos
  - 3ª `sales.csv` - Histórico de vendas

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
│   │   └──Dockerfile.frontend
│   ├── shared/
│   └── files/
│       ├── products.csv
│       ├── categories.csv
│       └── sales.csv
└── package.json
└── .dockerignore
└── docker-compose.yml
└── README.md

```

---

## Requisitos

- **Python 3.12+**
- **Node.js 18+**
- **Docker**
- **Yarn** ou **NPM** instalado globalmente na pasta raiz smart-mart.
- **pip** instalado (para dependências Python)

---

## Instalação e build Automático (RECOMENDADO)

### 1. Clonar o repositório e navegar para a raiz do projeto:

```bash
cd smart-mart
```

### 2. Instale o concurrency na pasta raiz:

```bash
cd smart-mart

yarn install
# ou
npm install
```

### 3. Rodando o docker com concurrency:

```bash
cd smart-mart

yarn start
# ou
npm start
```

---

## Instalação e build Manual (NÃO RECOMENDADO)

### 1. Instalação com concurrency

```bash
cd smart-mart

yarn install:frontend
# ou
npm install:frontend
```

### 2. Rodando o frontend com concurrency

```bash
cd smart-mart

yarn start:frontend
# ou
npm start:frontend
```

## Funcionalidades Implementadas

- Endpoint POST para inserir novos produtos
- Endpoint GET para listar produtos e vendas, incluindo o lucro
- Endpoint GET para listar categorias
- Endpoint POST para importar produtos, vendas e categorias via arquivo CSV
- Dashboard de Quantidade de Vendas, Evolução de venas e Lucro de Vendas
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
- Deploy do backend no Render
- Docker para conteinerização do frontend
- Visual hieráquica clara e escalável
- Exportação dos dados de **SaleAnalytics** para arquivo Excel formatado
