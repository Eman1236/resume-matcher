## Resume Matcher (TS + GraphQL + Postgres)

This service lets you upload a resume (TXT/PDF), extracts a simple profile (title, years of experience, skills), stores it in Postgres, and exposes a GraphQL API to find similar candidates based on overlapping skills.

### Stack

- **Runtime**: Node.js + TypeScript
- **API**: GraphQL (Apollo Server)
- **Database**: Postgres

### Scripts

- `npm run start:dev` – start the dev server with watch
- `npm run build` – compile TypeScript to `dist`
- `npm run start:prod` – run the compiled server

### Reflecting entity changes in the DB (TypeORM migrations)

1. **Apply existing migrations** (creates/updates tables):
   ```bash
   npm run migration:run
   ```
   Uses `PG_CONNECTION_STRING` from `.env`. The first run creates the `migrations` table and runs `InitialSchema` (tables match your entities).

2. **Generate a new migration** after you change entities:
   ```bash
   npm run migration:generate -n "AddEmailToCandidate"
   ```
   The migration file is always created in `src/migrations/` (TypeORM adds a timestamp prefix). Then run `npm run migration:run` to apply it.

3. **Other commands**
   - `npm run migration:show` – list migrations and whether they’re applied
   - `npm run migration:revert` – undo the last migration

### Env

Create a `.env` file:

```bash
PG_CONNECTION_STRING=postgres://user:password@localhost:5432/resume_matcher
PORT=4000
```

