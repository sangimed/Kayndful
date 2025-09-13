# Kayndful — Monorepo (API + Mobile)

> EN: Turns free time into acts of kindness — offer support or ask for help, all in one place.
> FR: Faites de votre temps libre une source de solidarité — pour aider ou être aidé, en toute simplicité.

This repository is a monorepo containing:

- server: REST API built with [NestJS](https://nestjs.com/)
- apps/mobile: Mobile app built with [Expo](https://expo.dev/) / React Native and [Expo Router](https://expo.github.io/router/)

See API module and routes overview in `server/docs/overview.md`.

## Prerequisites

- Node.js (LTS) and npm
- PostgreSQL (for the API)
- For mobile: Android Studio or Xcode; optional `npx expo` tooling

## Install (root)

Install all workspace dependencies from the monorepo root:

```bash
npm install
```

## Quick Start

### API (NestJS)

```bash
cp server/.env.example server/.env
npm --workspace server run start:dev
```

- Swagger: http://localhost:3000/api
- Seed demo data (optional):

  ```bash
  npm --workspace server exec ts-node src/seeds/seed.ts
  ```

#### Obtain a JWT token

After the server is running, generate a JWT using `/auth/login` (or `/auth/register`). Tokens are signed with `JWT_SECRET` from your `.env`. Using a token signed with a different secret returns `401 Unauthorized` on protected routes (e.g. `POST /offers`).

Example:

```bash
curl -X POST http://localhost:3000/auth/login \
     -H 'Content-Type: application/json' \
     -d '{"phone":"1234567890","password":"password"}'
```

Use the `accessToken` from the response as a Bearer token in subsequent requests.

### Mobile (Expo / React Native)

From the repository root:

```bash
# Start Metro and the app
npm run mobile

# Or target a platform directly
npm run mobile:android
npm run mobile:ios
```

Tips:
- Ensure an Android emulator or iOS Simulator is running, or connect a device.
- Press `a` / `i` in the Expo CLI to open Android / iOS.

### Equivalent per-workspace commands

You can also run commands directly inside workspaces:

```bash
# API
cd server && npm run start:dev

# Mobile
cd apps/mobile && npm start
```

## Repository Structure

```
.
├── server/              # NestJS REST API
└── apps/
    └── mobile/         # Expo React Native app (Expo Router)
```

## Environment (API)

Configure `server/.env` using `server/.env.example` as a base. Key variables:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `JWT_SECRET`

## Running with Docker (Database)

If you use Docker for the database:

```bash
docker compose up -d
```

Then start the API locally:

```bash
npm --workspace server run start:dev
```

API will be available at `http://localhost:3000` (Swagger at `/api`).

## Notes on Monorepo Setup

- npm workspaces are defined at the repo root and include `server` and `apps/*`.
- Metro is configured to work in a monorepo (`apps/mobile/metro.config.js`).

