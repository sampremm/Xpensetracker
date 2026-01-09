# Xpensetracker

This repository contains a full-stack Expense Tracker app.

- Backend: a Node.js + TypeScript API using Prisma (folder: `backend/`).
- Frontend: an Expo React Native app (folder: `my-expo-app/`).

This README gives a concise overview and quick setup steps for both backend and frontend.

**Repository layout**

- `backend/` — TypeScript API, Prisma schema, and migrations.
- `my-expo-app/` — Expo React Native frontend (App.tsx, screens, navigation).

**Backend (quickstart)**

1. Change into the backend folder and install dependencies:

```bash
cd backend
npm install
```

2. Configure `.env` in `backend/` with at minimum:

```
DATABASE_URL="your-database-connection-string"
JWT_SECRET="your_jwt_secret"
# Optional: PORT=4000
```

3. Generate Prisma client and apply migrations for development:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Start the server (or use scripts in `backend/package.json`):

```bash
node index.js
# or
npm run dev
```

**Prisma helpers**

- Open Prisma Studio: `npx prisma studio`
- Introspect DB: `npx prisma db pull`

**Backend API (high-level)**

- `POST /signup` — register a user
- `POST /login` — authenticate
- `POST /logout` — end session / invalidate token
- `/expenses` — CRUD endpoints for expenses

Example curl for signup:

```bash
curl -X POST http://localhost:4000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"securepass"}'
```

Adjust host/port according to your `PORT` setting or `backend/package.json` scripts.

**Frontend (quickstart)**

1. Change into the Expo app folder and install dependencies:

```bash
cd my-expo-app
npm install
```

2. Start the Expo development server:

```bash
npm start
# or
expo start
```

3. Run on device or emulator via Expo DevTools.

The frontend communicates with the backend API — ensure the backend server is reachable from your device (use local IP or tunneling when testing on a phone).

**Troubleshooting**

- If Prisma errors appear, re-run `npx prisma generate` and verify `DATABASE_URL`.
- If the frontend cannot reach the backend, check network configuration and use a reachable host/IP.

**Next steps / suggestions**

- Add `backend/.env.example` for required variables.
- Add `backend/README.md` with more detailed backend docs (I can create this on request).
- Add a Postman or OpenAPI spec for the API.

If you want, I can also create a focused `backend/README.md` and add a `.env.example` file — tell me which and I'll implement it.
