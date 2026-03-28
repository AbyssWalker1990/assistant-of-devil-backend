# SPEC.md — Assistant of Devil API

## Overview

**Assistant of Devil** is a backend API for an AI-powered conversational chatbot with gamification mechanics. The AI serves a dual role: it is both the conversational partner the user interacts with and an autonomous controller that issues structured JSON commands within its responses to drive system operations — managing auth, user state, conversation flow, gamification progression, and its own internal reasoning about the user.

The name "Assistant of Devil" implies a provocative, morally ambiguous AI persona — an assistant that may challenge, tempt, or test the user as part of the gamification loop.

## Core Concept

### Conversational AI with Embedded Commands

The central architectural idea is that the AI's response contains two layers:

1. **User-facing text** — the conversational reply shown to the user.
2. **System commands (JSON)** — structured instructions embedded in the response that the backend parses and executes against the database and other services.

This means the AI doesn't just talk — it *acts*. A single AI response might simultaneously reply to the user, update their gamification score, record an internal thought about the user's behavior, and transition the conversation to a new state.

### Example Command Flow

```
User sends message → API forwards to AI → AI responds with text + JSON commands
→ Backend parses commands → Executes DB mutations → Returns user-facing text to client
```

### Command Domains

The JSON command interface should cover (at minimum):

| Domain | Purpose | Example Operations |
|--------|---------|-------------------|
| **Auth** | User identity and session management | Create session, invalidate token, escalate permissions |
| **User State** | Profile, preferences, gamification data | Update score, set achievement, modify profile attributes |
| **Conversation State** | Dialogue context and flow control | Set topic, mark phase, store context variables |
| **AI Thoughts** | Internal AI reasoning about the user | Store observation, update user assessment, flag behavioral pattern |
| **Gamification** | Progression, rewards, challenges | Grant points, unlock level, trigger challenge, apply penalty |

## Current State (MVP)

### What exists

- Express.js HTTP API with versioned routing (`/api/v1`)
- PostgreSQL database with Drizzle ORM (currently only a `users` table)
- OpenAI integration via `SendMessageToAssistantService` (uses GPT-4o Responses API with conversation continuity via `previous_response_id`)
- Class-based service architecture with constructor dependency injection
- Custom error handling middleware
- Docker Compose setup (backend + PostgreSQL + pgAdmin)
- Basic CRUD endpoints for users (no auth, no validation)

### What's missing for MVP

- **AI command parsing layer** — extract and execute JSON commands from AI responses
- **Conversation endpoints** — send/receive messages, maintain conversation history
- **Auth system** — registration, login, session/token management
- **Conversation persistence** — store messages and conversation metadata in DB
- **AI prompt/system message configuration** — define the AI persona and command format
- **Input validation** — request body validation on all endpoints
- **Response shaping** — consistent API response format across all endpoints

## Data Model (Proposed)

Beyond the existing `users` table, the following entities are likely needed:

- **conversations** — conversation metadata (user_id, status, started_at, current_phase)
- **messages** — individual messages (conversation_id, role, content, created_at)
- **ai_commands** — log of parsed commands from AI responses (message_id, domain, action, payload, executed_at)
- **ai_thoughts** — AI's internal observations about users (user_id, content, category, created_at)
- **user_game_state** — gamification data (user_id, score, level, achievements as JSONB)
- **sessions** — auth sessions (user_id, token, expires_at)

## Suggestions for Improvement

### Architecture

1. **Define a JSON command schema** — Create a strict TypeScript interface for AI commands with discriminated unions per domain. This is the most critical design decision since everything flows from how commands are structured and validated. Consider something like:
   ```typescript
   type AICommand =
     | { domain: 'user_state'; action: 'update_score'; payload: { delta: number } }
     | { domain: 'conversation'; action: 'set_phase'; payload: { phase: string } }
     | { domain: 'ai_thoughts'; action: 'store'; payload: { content: string; category: string } }
   ```

2. **Command executor pattern** — Build a registry of command handlers keyed by `domain + action`. Each handler is a small service that validates the payload and performs the DB operation. This keeps the parsing layer thin and each command independently testable.

3. **Separate AI response parsing from business logic** — Create a dedicated service that takes raw AI output, extracts the JSON command block (e.g., from a fenced code block or a structured output schema), validates it, and returns typed commands + clean user-facing text.

4. **Use OpenAI structured outputs** — Instead of parsing free-form JSON from the AI response, use OpenAI's structured output feature (JSON schema mode) to guarantee the response conforms to your command schema. This eliminates parsing failures.

5. **Controller layer** — Routes currently contain business logic inline. Extract request handling into controller classes to keep routes as thin wiring.

### Infrastructure

6. **Request validation middleware** — Use a library like `zod` for runtime validation of request bodies and params. Drizzle pairs well with Zod via `drizzle-zod`.

7. **Auth middleware** — JWT or session-based auth as an Express middleware, applied to protected routes.

8. **Logging** — Replace `console.log`/`console.info` with a structured logger (e.g., `pino`) for production observability.

9. **Rate limiting** — Essential for an AI-backed API to control costs and prevent abuse.

10. **Environment-specific configs** — Separate dev/staging/prod configurations rather than a single `.env`.

### Future Considerations

11. **WebSocket migration path** — Design the conversation service so transport is abstracted. The message handling logic should not depend on HTTP request/response — this makes a future WebSocket layer a transport swap rather than a rewrite.

12. **AI provider abstraction** — Wrap the OpenAI client behind an interface so switching to another provider (or using multiple) doesn't require changes throughout the codebase.

13. **Command audit trail** — Log every AI command execution with its result. This is valuable for debugging AI behavior, understanding user journeys, and potentially replaying or undoing AI actions.

14. **Prompt versioning** — Store system prompts and persona definitions in the database or config files with versioning, so AI behavior changes are tracked and reversible.
