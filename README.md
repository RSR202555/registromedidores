# Registro de Horímetro

Sistema para registro e visualização de horímetros de máquinas agrícolas.

## Funcionalidades
- Cadastro de registros de horímetro (data, horários, operador, máquina, talhão, atividade, linhas feitas)
- Visualização e filtro dos registros
- Login de administrador (apenas para painel admin)
- Edição e exclusão de registros
- Cálculo de horas por máquina/talhão/mês/dia

## Tecnologias Utilizadas
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Hospedagem sugerida:** Render (backend) e Vercel/Netlify (frontend)

## Instalação Local

### 1. Clone o repositório
```sh
git clone https://github.com/SEU_USUARIO/NOME_DO_REPO.git
cd NOME_DO_REPO
```

### 2. Instale as dependências
```sh
cd backend
npm install
cd ../frontend
npm install
```

### 3. Configure as variáveis de ambiente do backend
Crie um arquivo `.env` na pasta `backend` com:
```
SUPABASE_URL=... (sua URL do Supabase)
SUPABASE_KEY=... (sua service_role ou anon key)
```

### 4. Rode o backend
```sh
cd backend
node index.js
```

### 5. Rode o frontend
```sh
cd frontend
npm run dev
```

Acesse o frontend em `http://localhost:5173` e o backend em `http://localhost:3001`.

## Deploy no Render (backend)
1. Suba o projeto para o GitHub.
2. Crie um novo Web Service no [Render](https://dashboard.render.com/), apontando para a pasta `backend`.
3. Configure as variáveis de ambiente no painel do Render.
4. O Render fornecerá uma URL pública para o backend.

## Deploy do frontend
- Sugestão: Vercel, Netlify ou Surge.sh
- Basta apontar para a pasta `frontend` e configurar a URL do backend nas requisições.

## Licença
MIT 