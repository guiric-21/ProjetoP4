# Projeto API de Gerenciamento de Tarefas

Este projeto é uma API RESTful desenvolvida para a disciplina de **Programação 4** da faculdade. Ela permite o gerenciamento de tarefas (CRUD), autenticação de usuários e filtragem das tarefas, pela prioridade por exemplo.

## Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Token) para autenticação
- bcryptjs para hash de senhas
- dotenv para variáveis de ambiente

---

## Funcionalidades

- **Cadastro e login de usuários**
- **Criação, listagem, atualização e remoção de tarefas**
- **Filtro de tarefas por prioridade, status e data**
- **Proteção de rotas com autenticação JWT**

---

## Como rodar o projeto

1. **Clone o repositório**
   ```bash
   git clone https://github.com/guiric-21/ProjetoP4.git
   cd ProjetoP4
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
   ```
   MONGO_URI=mongodb://localhost:27017/seubanco
   JWT_SECRET=sua_chave
   PORT=5000
   ```

4. **Inicie o servidor**
   ```bash
   npm run dev
   ```
   O servidor estará rodando em `http://localhost:5000`

---

## Endpoints Principais

### Autenticação

- **Registrar usuário**
  - `POST /api/auth/register`
  - Body:
    ```json
    {
      "username": "usuario",
      "password": "senha"
    }
    ```

- **Login**
  - `POST /api/auth/login`
  - Body:
    ```json
    {
      "username": "usuario",
      "password": "senha"
    }
    ```
  - Resposta: `{ "token": "JWT_TOKEN" }`

### Tarefas (protegido por JWT)

Adicione o header:  
`Authorization: Bearer SEU_TOKEN_AQUI`

- **Criar tarefa**
  - `POST /api/tasks`
  - Body:
    ```json
    {
      "title": "Título",
      "description": "Descrição",
      "priority": "baixa | média | alta",
      "status": "não iniciada | em andamento | concluída",
      "dueDate": "2025-07-01"
    }
    ```

- **Listar tarefas**
  - `GET /api/tasks`
  - Filtros opcionais: `?priority=alta`

- **Buscar tarefa por ID**
  - `GET /api/tasks/:id`

- **Atualizar tarefa**
  - `PUT /api/tasks/:id`
  - Body: (campos que deseja atualizar)

- **Remover tarefa**
  - `DELETE /api/tasks/:id`

---

## Testando a API

Recomenda-se o uso do [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) para testar os endpoints.

---

## Estrutura de Pastas

```
ProjetoP4/
│
├── controllers/
│   └── taskController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Task.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── taskRoutes.js
├── server.js
└── .env
```

---