# Kayndful Backend

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
