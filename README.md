# Kayndful Backend

This repository contains the Kayndful REST API built with [NestJS](https://nestjs.com/).

Detailed information about the existing modules and routes is available in [docs/overview.md](docs/overview.md).

## Quick start

```bash
cd server
npm install
npm run start:dev
```

Swagger documentation is exposed at `http://localhost:3000/api` once the server is running.


## Running with Docker

A `docker-compose.yml` is provided for local development. It starts PostgreSQL and the NestJS server:

```bash
docker compose up
```

The API will then be available at `http://localhost:3000` with Swagger docs at `/api`.
