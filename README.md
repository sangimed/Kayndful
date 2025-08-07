# Kayndful - Monorepo codebase

> EN : Turns free time into acts of kindness — offer support or ask for help, all in one place.
> FR : Fait de votre temps libre une source de solidarité — pour aider ou être aidé, en toute simplicité.

This repository contains the Kayndful REST API built with [NestJS](https://nestjs.com/).

Detailed information about the existing modules and routes is available in [docs/overview.md](docs/overview.md).

## Quick start

```bash
cd server
cp .env.example .env
npm install
npm run start:dev
```

Swagger documentation is exposed at `http://localhost:3000/api` once the server is running.

To populate the database with a demo user for testing, run the seed script:

```bash
cd server
npx ts-node src/seeds/seed.ts
```

### Obtaining a JWT token

After the server is running, generate a JWT using the `/auth/login` endpoint (or `/auth/register`).
Tokens are signed with the `JWT_SECRET` value from your `.env` file. Using a token
signed with a different secret will result in a `401 Unauthorized` response when
calling protected routes such as `POST /offers`.

#### Example usage

1. Seed the database with the demo account:

   ```bash
   cd server
   npx ts-node src/seeds/seed.ts
   ```

2. Obtain a token by logging in with the seeded user:

   ```bash
   curl -X POST http://localhost:3000/auth/login \
        -H 'Content-Type: application/json' \
        -d '{"phone":"1234567890","password":"password"}'
   ```

   The response JSON includes `accessToken` which should be provided as a Bearer
   token in subsequent requests.

3. Call a protected endpoint, e.g. creating an offer:

   ```bash
   curl -X POST http://localhost:3000/offers \
        -H "Authorization: Bearer <your accessToken>" \
        -H 'Content-Type: application/json' \
        -d '{"title":"Help","description":"Demo","category":"general","pointCost":1,"availability":true}'
   ```

If you still receive `401 Unauthorized`, ensure that the server was started after
copying `.env.example` to `.env` and that both the login request and the
protected request use the same server instance.


## Running with Docker

`docker-compose.yml` only starts a PostgreSQL container for development:

```bash
docker compose up -d
```

Then run the NestJS server locally:

```bash
cd server && npm run start:dev
```

The API will be available at `http://localhost:3000` with Swagger docs at `/api`.

## Running in GitHub Actions

The workflow file `.github/workflows/dev.yml` can spin up the development
environment inside GitHub Actions using service containers. Trigger it from the
**Actions** tab by selecting **Dev Environment** and choosing **Run workflow**.
The job installs dependencies and starts the NestJS server with a PostgreSQL
service so you can review logs directly in the workflow run.
