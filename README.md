# CRUD Área de Login e Cadastro - React + Vite

Este projeto é uma aplicação web de cadastro, login e gerenciamento de treinos, desenvolvida em **React** com **Vite**. O frontend consome uma API RESTful hospedada no Vercel, com autenticação JWT e persistência em MongoDB.

## Funcionalidades

- Cadastro de usuário
- Login com autenticação JWT
- Logout
- CRUD de treinos (criar, listar, editar, excluir)
- Feedback visual com React Toastify
- Modal de confirmação para exclusão
- Responsivo para desktop e mobile

## Tecnologias Utilizadas

- **Frontend:** React 19 + Vite
- **Gerenciamento de rotas:** React Router DOM
- **Notificações:** React Toastify
- **Estilização:** CSS puro e variáveis CSS
- **Backend:** [crud-autenticado-mongodb](https://crud-autenticado-mongodb.vercel.app/) (Node.js + Express + MongoDB, hospedado no Vercel)

## Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd Crud-area-login-cadastro
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Rodar o projeto

```bash
npm run dev
```

Acesse `http://localhost:5173` no seu navegador.

## Observações

- Este projeto foi desenvolvido como um estudo de caso para aprimoramento em React e Vite.
- A API utilizada no backend foi desenvolvida separadamente e está hospedada no Vercel.
- Para autenticação, foi utilizado o padrão JWT (JSON Web Token).
- O gerenciamento de estado global foi feito com o Context API do React.
