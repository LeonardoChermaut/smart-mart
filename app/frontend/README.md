<h1>Task Manager - React Query</h1>

<p>Aplicação para criação e gerenciamento de tarefas com filtros por status e prioridade. Utiliza React com TypeScript, React Query para manipulação assíncrona de dados, TailwindCSS para design e json-server como API REST fake. Inclui também testes automatizados com Cypress.</p>

<hr />

<h2>Funcionalidades</h2>
<ul>
  <li>Criar, editar e excluir tarefas</li>
  <li>Filtros por status (pendente, em progresso, concluída)</li>
  <li>Filtros por prioridade (alta, média, baixa)</li>
  <li>Paginação com seletor de "itens por página"</li>
  <li>Persistência local com json-server</li>
  <li>Interface responsiva e moderna</li>
  <li>Testes unitários com Cypress</li>
</ul>

<hr />

<h2>Como rodar o projeto</h2>
<ol>
  <li>Instale as dependências:</li>
</ol>
<pre><code>yarn
</code></pre>

<ol start="2">
  <li>Inicie a aplicação com json-server:</li>
</ol>
<pre><code>yarn dev
</code></pre>

<p>A aplicação estará disponível em: <code>http://localhost:5173/</code></p>
<p>A API fake estará em: <code>http://localhost:3001/tasks</code></p>

<hr />

<h2>Como rodar os testes</h2>
<p>Este projeto utiliza <a href="https://www.cypress.io/" target="_blank" rel="noopener noreferrer">Cypress</a> para testes end-to-end. Para iniciar:</p>
<pre><code>yarn cypress open
</code></pre>

<hr />

<h2>Estrutura do Projeto</h2>
<pre><code>src/
├── components/        # Componentes reutilizáveis
├── modules/           # Módulos de funcionalidades
├── router/            # Rotas da aplicação
└── shared/
    ├── hook/          # React Query hooks
    ├── service/       # Comunicação com json-server
    ├── utils/         # Utilitários compartilhados
    ├── interface/     # Interfaces TypeScript
    └── mock/          # db.json para json-server
</code></pre>
