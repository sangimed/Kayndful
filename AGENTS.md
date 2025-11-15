# Instructions for agents (Codex / AI)

These rules apply to the entire `Kayndful` monorepo.

## Required lint & format

- The agent must ensure the project matches the repo’s linting and formatting rules **only at the very end of handling a prompt** (once all files are created/modified), not after every small change.
- From the repo root, always run at the end:
  - `npm run lint:fix`
  - `npm run format`
- Do not introduce any additional lint/format tools beyond the existing ESLint + Prettier setup.

## General style

- Write TypeScript (`.ts` / `.tsx`) and respect the existing configuration (`.eslintrc.cjs`, `eslint.config.js`, `.prettierrc.json`).
- Produce code that is already roughly formatted to minimize automatic fixes.
- Keep changes as small and focused on the task as possible, and follow existing patterns (naming, component structure, stores, services).
