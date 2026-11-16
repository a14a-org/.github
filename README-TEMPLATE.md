# <Project name>

One or two sentences: what this is and who uses it.

- **Status:** active | maintenance only | experiment
- **Live at:** <URL, or "not deployed">
- **Owner:** <person or team to ask>

## Run it locally

Prerequisites (runtime and version, database, other services), then the
commands, in order, that take a fresh clone to a running app:

```sh
bun install
cp .env.example .env
bun dev
```

## Environment variables

| Variable | Required | What it is for |
|---|---|---|
| `DATABASE_URL` | yes | Postgres connection string |

Point to `.env.example` for the full list. Never put real values here.

## Checks

The commands CI runs, so they can be run before pushing:

```sh
bun run lint:check
bun run typecheck
bun run test
bun run build
```

## Deploy

How a change reaches production: which branch deploys, on which platform, and
where the health check is. Say so if deployment is manual.

## More

Links to architecture notes, runbooks or decisions, if any.
