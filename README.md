# Xpensetracker

This repository contains a full-stack Expense Tracker application. The backend is a Node.js + TypeScript API using Prisma for database access. The frontend is a React/Expo-based app (in the `Frontend/` folder).

This README focuses on the backend located in the `backend/` folder and explains how to set it up and run locally.

## Backend — overview

- Location: `backend/`
- Language: TypeScript (source in `backend/src/`) with a compiled/runtime entry at `backend/index.js`.
- Database: Prisma (schema in `backend/prisma/schema.prisma`, migrations in `backend/prisma/migrations/`).
- Main responsibilities: user signup/login/logout and expense CRUD endpoints (see `backend/src/controller/`).

Key backend files
- `backend/index.js` — runtime entrypoint for the backend server.
- `backend/src/index.ts` — TypeScript server bootstrap (source).
- `backend/src/controller/` — controllers for `expense`, `signup`, `login`, `logout`.
- `backend/src/middleware/auth.ts` — authentication middleware.
- `backend/src/Db/db.ts` — Prisma client initialization.
- `backend/prisma/schema.prisma` — Prisma schema and models.

## Prerequisites

- Node.js (recommended v16+) and npm installed.
- Git (optional, to clone repository).
- A database compatible with Prisma (the project expects a `DATABASE_URL` defined in `.env`).

Check or create a `.env` file in `backend/` with at least:

```
DATABASE_URL="your-database-connection-string"
# (Optional) PORT=4000
# (Optional) JWT_SECRET=your_jwt_secret
```

Note: The exact environment variable names and values are in the project `.env` (if present) — verify before running.

## Setup (local development)

1. Open a terminal and change into the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client (required if dependencies or schema changed):

```bash
npx prisma generate
```

4. Run database migrations (choose one depending on whether you are developing or deploying):

# For local development creating/previewing new migrations
npx prisma migrate dev --name init

# For applying migrations in a deployed environment
npx prisma migrate deploy

5. Run the server:

# If you want to run the bundled JS
node index.js

# If you prefer to run the TypeScript source directly (requires ts-node / ts-node-dev)
# Example (if project has a dev script or ts-node installed):
# npx ts-node-dev src/index.ts

Note: The repository contains a pre-built `index.js` in `backend/`, so `node index.js` should start the server unless your package.json uses different scripts. If you prefer, run the script defined in `backend/package.json` (for example `npm run dev`).

## Useful Prisma commands

- Open Prisma Studio (visual DB browser):

```
npx prisma studio
```

- Introspect an existing database

```
npx prisma db pull
```

## API endpoints (high-level)

The backend controllers indicate the following core endpoints (confirm exact paths in `backend/src/routes/router.ts`):

- POST /signup — register a new user (controller: `signup.ts`)
- POST /login — authenticate (controller: `login.ts`)
- POST /logout — end session / invalidate token (controller: `logout.ts`)
- /expenses — expense-related endpoints (controller: `expense.ts`) — create, read, update, delete operations

Example curl (signup):

```bash
curl -X POST http://localhost:4000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"securepass"}'
```

Example curl (login):

```bash
curl -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"securepass"}'
```

Adjust the port and body to the actual server configuration and expected payload.

## Notes, assumptions, and verification

- This README was generated from the backend folder layout and common conventions. I assumed the server listens on a `PORT` and uses a `DATABASE_URL` in `.env`. If different environment variable names are used, prefer the ones defined in the repository's `.env` or `package.json` scripts.
- If the project uses custom npm scripts (for example `npm run dev`), use those instead of the raw `node` or `ts-node` commands above. Check `backend/package.json` for exact script names.

## Troubleshooting

- If Prisma complains about the migrations or client, re-run `npx prisma generate` and ensure `DATABASE_URL` is valid.
- If `node index.js` fails with missing modules, run `npm install` inside `backend/` and re-run.
- If you need the TypeScript dev flow and `ts-node-dev` is not installed, either install it locally or run the compiled `index.js`.

## Next steps (optional improvements)

- Add `backend/.env.example` with required variables and brief descriptions.
- Add a small `Makefile` or npm scripts for common tasks (setup, migrate, dev, start).
- Add a Postman collection or OpenAPI spec for the API endpoints.

## Contributing

If you want me to: add `.env.example`, wire up a `npm run dev` script with `ts-node-dev`, or create a Postman collection / API docs — tell me which and I'll implement it.

---

If you'd like, I can also generate a short `backend/README.md` inside the `backend/` folder with the same content but scoped to the backend only.
