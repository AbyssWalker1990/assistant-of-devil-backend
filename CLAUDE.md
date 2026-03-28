# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Description

Backend API for an AI-powered chatbot with gamification and broad AI-driven decision-making. The AI assistant communicates with users conversationally and embeds structured JSON commands within its responses to manage various system operations, including:
- **Auth** — user authentication and session management
- **User state** — tracking and updating user progress, profile, and gamification data
- **Conversation state** — maintaining context and flow of dialogue
- **AI reasoning** — storing the AI's internal thoughts/assessments about the user

The AI acts as both a conversational partner and an autonomous controller that drives DB mutations through its JSON command interface. The full scope of AI-managed operations is still evolving.

**Current phase:** MVP using HTTP REST endpoints. A future migration to WebSockets is under consideration for real-time communication.

## Commands

```bash
# Development
npm run dev              # Watch mode: compiles TS + restarts server via nodemon
npm run build            # Compile TypeScript (npx tsc)
npm start                # Run compiled output (node dist/src/server.js)

# Testing
npm test                 # Run all Jest tests
npx jest path/to/file    # Run a single test file

# Linting & Formatting
npm run lint             # ESLint check
npm run format           # ESLint auto-fix
npm run pretty           # Prettier auto-fix

# Database (Drizzle)
npm run db:generate      # Generate migration from schema changes
npm run db:up            # Run pending migrations
npm run db:down          # Rollback migrations
npm run db:studio        # Open Drizzle Studio GUI

# Docker
docker compose up        # Start backend, postgres, pgadmin
```

## Architecture

Express.js API with TypeScript, PostgreSQL via Drizzle ORM, and OpenAI integration.

**Entry flow:** `src/server.ts` → loads env vars via `ParseEnvVariablesService` → starts Express app defined in `src/app.ts` → mounts routes at `/api/v1`.

**Service pattern:** All services are classes with a `handle()` method. Dependencies are passed via constructor injection (no DI container). Services are organized into:
- `src/v1/config/` — factory services (Drizzle client, OpenAI client)
- `src/v1/services/` — env parsing, DB connection
- `src/v1/services/business-logic/` — domain logic (e.g., assistant message handling)

**Error handling:** Custom exception hierarchy rooted in `AbstractHttpResponseError`. Errors are caught by `ErrorMiddleware` and returned as typed JSON responses using `ResponseErrorCodeEnum`.

**Database:** Schema defined in `database/schema.ts`, migrations in `database/migrations/`. Drizzle ORM connects via `pg` pool configured from env vars.

**ESLint rules to note:** explicit function return types required, unused imports flagged as errors.

**Prettier:** single quotes, no semicolons, 120 char width, trailing commas.
