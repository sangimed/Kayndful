# Kayndful — Monorepo (API + Mobile)
<p align="center">
  <img src="apps/mobile/assets/kayndful-logo.svg" alt="Kayndful Logo" width="200" />
</p>

Turns free time into acts of kindness — offer support or ask for help, all in one place.

This repository is a monorepo containing:

- `server`: REST API built with [NestJS](https://nestjs.com/)
- `apps/mobile`: Mobile app built with [Expo](https://expo.dev/) / React Native and [Expo Router](https://expo.github.io/router/)

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
server/            # NestJS REST API
apps/
  mobile/          # Expo React Native app (Expo Router)
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

## Code Quality: Linting & Formatting

This repository standardizes linting and formatting across the monorepo using:

- ESLint (flat config at the repo root: `eslint.config.js`) for TypeScript `.ts/.tsx`.
- Prettier (shared config at root: `.prettierrc.json`, with ignores in `.prettierignore`).
- Husky pre-commit hook + lint-staged to auto-fix only the staged files.
- CI (GitHub Actions) to enforce `lint` and `format:check` on push/PR.

### Quick Usage

- Format everything (root):

  ```bash
  npm run format
  ```

- Check formatting without writing (root):

  ```bash
  npm run format:check
  ```

- Lint (root):

  ```bash
  npm run lint
  ```

- Per workspace examples:

  ```bash
  # Mobile app
  npm --workspace apps/mobile run lint
  npm --workspace apps/mobile run format

  # Server API
  npm --workspace server run lint
  npm --workspace server run format
  ```

### Pre-commit Hook (Husky + lint-staged)

- On `git commit`, Husky runs `lint-staged` which:
  - For `*.{ts,tsx}`: runs `eslint --fix` then `prettier --write`.
  - For `*.{js,jsx,cjs,mjs,json,md,yml,yaml,css,scss,html}`: runs `prettier --write`.
- Only staged files are processed, so it’s fast and non-blocking.
- If an error can’t be auto-fixed (e.g., a strict ESLint rule), fix locally and commit again.

Tip: To debug the hook locally, run `npx lint-staged --debug`.

### IDE Integration (recommended)

- Enable format-on-save in your editor for the best experience.
- Example VS Code settings (`.vscode/settings.json` or via Settings UI):

  ```json
  {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
  ```

### Continuous Integration (CI)

- Workflow: `.github/workflows/ci.yml`.
- On push/PR, CI runs:
  - `npm run lint` (ESLint over `.ts/.tsx`)
  - `npm run format:check` (fails if Prettier formatting is not respected)
- To prevent merges if quality fails, enable a Branch protection rule and mark these checks as Required.

### Extending ESLint Rules

- Base: `eslint.config.js` at the repo root (flat config).
- You can add more rules/plugins (e.g., React, React Native, NestJS) if you want stricter checks.
- Minimal example to add a TypeScript rule:

  ```js
  // eslint.config.js (excerpt)
  export default [
    // ...
    {
      files: ['**/*.{ts,tsx}'],
      // ...
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      },
    },
  ];
  ```

### Troubleshooting

- `format:check` fails: run `npm run format` to apply Prettier, then commit the changes.
- ESLint warning "MODULE_TYPELESS_PACKAGE_JSON": harmless. Optionally add `"type": "module"` to the root `package.json` to silence it.
- Hook feels slow: remember `lint-staged` only processes staged files; avoid adding heavy tasks (tests, builds) to the pre-commit hook—keep them in CI.
