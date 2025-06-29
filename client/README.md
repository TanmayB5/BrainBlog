# AI Blog Web - Monorepo

## Project Structure

```
project-root/
├── client/ (React frontend)
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   ├── public/
│   └── ...
├── server/ (Node.js backend)
│   ├── package.json
│   ├── index.js
│   ├── routes/
│   ├── prisma/
│   └── ...
├── README.md
└── .gitignore
```

## Setup Instructions

### 1. Clone the repository
```sh
git clone <repo-url>
cd ai-blog-web
```

### 2. Install dependencies
#### Client
```sh
cd client
npm install
```
#### Server
```sh
cd ../server
npm install
```

### 3. Environment Variables
- Copy `.env.example` to `.env` in both `client/` and `server/` and fill in the values.

#### Client `.env.example`
```
VITE_API_URL=http://localhost:5000/api
```

#### Server `.env.example`
```
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173
```

### 4. Development Workflow
#### Start Backend
```sh
cd server
npm run dev
```
#### Start Frontend
```sh
cd ../client
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### 5. Build for Production
#### Client
```sh
cd client
npm run build
```
#### Server
```sh
cd server
npm run build # (if needed)
```

### 6. Deployment on Render
- Deploy `client/` as a static site.
- Deploy `server/` as a web service.
- Set environment variables in Render dashboard for both services.

## Notes
- All API calls in the frontend use `VITE_API_URL`.
- Backend CORS is configured via `CLIENT_ORIGIN`.
- Prisma is only in the server.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
