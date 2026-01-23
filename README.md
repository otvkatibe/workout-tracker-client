# Workout Tracker

Sistema completo de gerenciamento de treinos com autenticação JWT.

![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646cff?style=for-the-badge&logo=vite)
![React Router](https://img.shields.io/badge/React_Router-7.12.0-ca4245?style=for-the-badge&logo=react-router)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## Sobre o Projeto

**Workout Tracker** é uma aplicação web moderna para gerenciamento de treinos físicos. Desenvolvida com React 19, Vite e Tailwind CSS, a aplicação apresenta uma interface **moderna e premium**, utilizando conceitos de **Glassmorphism**, gradientes vibrantes e animações fluidas para criar uma experiência de usuário envolvente e intuitiva, com autenticação segura via JWT.

### Principais Funcionalidades

- **Autenticação Completa**
  - Cadastro de novos usuários
  - Login com token JWT
  - Rotas protegidas
  - Logout seguro

- **Gerenciamento de Treinos**
  - Criação de treinos com título, descrição e duração
  - Listagem de todos os treinos do usuário
  - Edição inline de treinos existentes
  - Exclusão com modal de confirmação

- **Experiência do Usuário (UI/UX)**
  - Design premium com Glassmorphism
  - Interface responsiva e fluida (desktop e mobile)
  - Animações e micro-interações para engajamento
  - Feedback visual com notificações toast e loaders elegantes
  - Ícones SVG modernos substituindo emojis
  - Validação de formulários com feedback imediato

---

## Tecnologias Utilizadas

### Core

- **[React 19.1.0](https://react.dev/)** - Biblioteca JavaScript para construção de interfaces
- **[Vite 6.3.5](https://vitejs.dev/)** - Build tool moderna e extremamente rápida
- **[Tailwind CSS 4.1.18](https://tailwindcss.com/)** - Framework CSS para estilização moderna e responsiva
- **[React Router DOM 7.12.0](https://reactrouter.com/)** - Gerenciamento de rotas e navegação

### Bibliotecas Adicionais

- **[React Toastify 11.0.5](https://fkhadra.github.io/react-toastify/)** - Notificações elegantes e customizáveis
- **ESLint** - Linter para manutenção de código limpo

### Backend

- API RESTful Node.js + Express + MongoDB
- Autenticação JWT (JSON Web Token)
- Hospedado no Vercel

---

## Estrutura do Projeto

```text
workout-tracker-client/
├── src/
│   ├── components/
│   │   ├── ConfirmModal.jsx      # Modal de confirmação para exclusões
│   │   ├── Loader.jsx             # Componente de loading
│   │   └── WorkoutCard.jsx        # Card para exibição de treinos
│   ├── contexts/
│   │   └── LoadingContext.jsx     # Context API para gerenciar loading global
│   ├── hooks/
│   │   └── useAuth.js             # Hook customizado para autenticação
│   ├── pages/
│   │   ├── Login.jsx              # Página de login
│   │   ├── Register.jsx           # Página de cadastro
│   │   └── Workouts.jsx           # Página principal (CRUD de treinos)
│   ├── App.jsx                    # Componente raiz com rotas
│   ├── App.css                    # Estilos globais
│   ├── index.css                  # Reset e variáveis CSS
│   └── main.jsx                   # Ponto de entrada da aplicação
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## Como Executar o Projeto

### Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**

### Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/otvkatibe/workout-tracker-client.git
cd workout-tracker-client
```

1. **Instale as dependências**

```bash
npm install
```

1. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://sua-api-url.com/api/
```

1. **Execute o projeto em modo de desenvolvimento**

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Cria build de produção
npm run preview  # Preview do build de produção
npm run lint     # Executa o linter
```

---

## Funcionalidades Detalhadas

### Sistema de Autenticação

- Cadastro com validação de campos
- Login com geração de token JWT
- Proteção de rotas privadas
- Redirecionamento automático baseado no status de autenticação

### CRUD de Treinos

- **Create**: Formulário para adicionar novos treinos
- **Read**: Listagem com cards organizados
- **Update**: Edição inline sem sair da página
- **Delete**: Exclusão com confirmação via modal

### Tratamento de Erros

- Mensagens de erro amigáveis e contextualizadas
- Validação em tempo real
- Feedback visual para todas as ações

---

## Padrões e Boas Práticas

- Componentização e reutilização de código
- Context API para gerenciamento de estado global
- Custom hooks para lógica compartilhada
- Clean Code e nomenclatura semântica
- Separação de responsabilidades (components, pages, contexts, hooks)
- Validação e tratamento de erros consistente
- Design responsivo mobile-first

---

## Segurança

- Autenticação via JWT (JSON Web Token)
- Token armazenado no localStorage
- Validação de token em todas as requisições protegidas
- Expiração automática de sessão
- Sanitização de inputs do usuário

---

## Melhorias Futuras

- [ ] Implementar paginação na listagem de treinos
- [ ] Adicionar filtros e busca de treinos
- [ ] Sistema de categorias de treinos
- [ ] Gráficos e estatísticas de progresso
- [ ] PWA (Progressive Web App)
- [ ] Modo escuro
- [ ] Testes unitários e de integração
- [ ] Internacionalização (i18n)

---

## Autor

Desenvolvido por **otvkatibe**

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

> Se este projeto te ajudou, considere dar uma estrela!

- O gerenciamento de estado global foi feito com o Context API do React.
