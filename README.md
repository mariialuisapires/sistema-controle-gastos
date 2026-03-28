# 💰 Sistema de Controle de Gastos Residenciais

Sistema full-stack para controle de gastos residenciais, permitindo cadastrar pessoas, categorias e transações financeiras, com relatório de totais por pessoa.

---

## 🛠️ Tecnologias utilizadas

**Back-end**
- C# com .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- Swagger (Swashbuckle)

**Front-end**
- React 18
- TypeScript
- Vite
- Axios
- React Router DOM

---

## ⚙️ Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)
- [PostgreSQL](https://www.postgresql.org/download)

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório
```bash
git clone https://github.com/mariialuisapires/sistema-controle-gastos.git
cd sistema-controle-gastos
```

### 2. Configure o banco de dados

Abra o arquivo `GastosResidenciais.API/appsettings.json` e edite a connection string com suas credenciais do PostgreSQL:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=gastos_db;Username=postgres;Password=SUA_SENHA"
}
```

### 3. Rode o back-end
```bash
cd GastosResidenciais.API
dotnet restore
dotnet ef database update
dotnet run
```

A API estará disponível em `http://localhost:5156`
A documentação Swagger em `http://localhost:5156/swagger`

### 4. Rode o front-end

Abra um novo terminal:
```bash
cd gastos-frontend
npm install
npm run dev
```

O front-end estará disponível em `http://localhost:5173`

---

## 📋 Funcionalidades

### Pessoas
- Cadastrar, editar, listar e deletar pessoas
- Ao deletar uma pessoa, todas as suas transações são removidas automaticamente

### Categorias
- Cadastrar e listar categorias
- Cada categoria tem uma finalidade: **Despesa**, **Receita** ou **Ambas**

### Transações
- Cadastrar e listar transações vinculadas a uma pessoa e uma categoria
- **Regra:** pessoas menores de 18 anos só podem ter transações do tipo **Despesa**
- **Regra:** a categoria deve ser compatível com o tipo da transação (ex: uma transação de Despesa não pode usar uma categoria de Receita)

### Totais por Pessoa
- Exibe o total de receitas, despesas e saldo de cada pessoa
- Exibe o total geral de todas as pessoas ao final

---

## 🗂️ Estrutura do projeto
```
sistema-controle-gastos/
├── GastosResidenciais.API/        # Back-end .NET
│   ├── Controllers/               # Endpoints da API
│   ├── Data/                      # DbContext (conexão com o banco)
│   ├── Models/                    # Entidades (Pessoa, Categoria, Transação)
│   ├── Migrations/                # Migrations do Entity Framework
│   ├── Program.cs                 # Configuração e ponto de entrada
│   └── appsettings.json           # Configurações (connection string)
│
└── gastos-frontend/               # Front-end React
    └── src/
        ├── pages/                 # Telas da aplicação
        ├── services/              # Chamadas HTTP para a API
        └── App.tsx                # Roteamento e navegação
```

---

## 📡 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/pessoas | Lista todas as pessoas |
| POST | /api/pessoas | Cadastra uma pessoa |
| PUT | /api/pessoas/{id} | Atualiza uma pessoa |
| DELETE | /api/pessoas/{id} | Deleta pessoa e suas transações |
| GET | /api/categorias | Lista todas as categorias |
| POST | /api/categorias | Cadastra uma categoria |
| GET | /api/transacoes | Lista todas as transações |
| POST | /api/transacoes | Cadastra uma transação |
| GET | /api/transacoes/totais | Retorna totais por pessoa e total geral |