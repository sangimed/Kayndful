# Kayndful API Overview

This document describes the current capabilities of the Kayndful backend implemented with NestJS. Authentication is based on JWT tokens and the database layer uses PostgreSQL via TypeORM.

## Project layout

- `server/` — NestJS application sources
- `server/src/auth` — authentication and token management
- `server/src/users` — user CRUD operations
- `server/src/service-offers` — service offer listing and management
- `server/src/transactions` — point transfer transactions
- `server/src/tasks` — scheduled tasks (monthly bonus, not yet implemented)
- `server/src/seeds` — seed script for demo data

## Main entities

### User
- `id` — primary key
- `phone` — unique phone number used for login
- `password` — hashed password
- `name`
- `location` *(optional)*
- `pointsBalance` — points owned by the user (default 100)
- `accountType` — `FREE` or `PREMIUM`
- `createdAt`, `updatedAt`

### ServiceOffer
- `id`
- `title`, `description`, `category`
- `pointCost` — cost in points to purchase
- `availability` — whether the offer is active
- `provider` — link to the `User` who provides the service
- `createdAt`, `updatedAt`

### Transaction
- `id`
- `fromUser`, `toUser` — users involved in the exchange
- `service` — reference to the purchased offer
- `points` — amount transferred
- `timestamp`

## Modules and routes

### Auth (`/auth`)
- `POST /register` — create a new user and immediately return a token
- `POST /login` — log in and receive JWT + refresh token
- `POST /profile` — return the profile of the authenticated user
- `POST /refresh` — obtain a new access token with a refresh token

### Users (`/users`)
- `POST /` — create a user
- `GET /` — list users *(JWT required)*
- `GET /:id` — get user details *(JWT required)*
- `PUT /:id` — update user *(JWT required)*
- `DELETE /:id` — delete user *(JWT required)*

### Offers (`/offers`)
- `POST /` — create an offer *(JWT required)*
- `GET /` — list all offers
- `GET /:id` — get a single offer
- `PUT /:id` — update an offer *(JWT required)*
- `DELETE /:id` — delete an offer *(JWT required)*

### Transactions (`/transactions`)
- `POST /` — transfer points between users for a given offer *(JWT required)*
- `GET /` — list all transactions *(JWT required)*

## Scheduled tasks

`MonthlyBonusService` will add a monthly point bonus to `PREMIUM` accounts. The service exists but the cron job still needs to be implemented.

## Database configuration

PostgreSQL connection parameters are read from environment variables:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `JWT_SECRET` for signing tokens

## Running the server

```bash
cd server
npm install
npm run start:dev
```

Once running, the API is available at `http://localhost:3000` and Swagger docs are served at `/api`.
