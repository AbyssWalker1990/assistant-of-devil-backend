# Plan: AI Users & User Facts — Tables + Full CRUD

## Context

The AI assistant needs its own user-tracking system — separate from the existing `users` auth table. It stores people the AI interacts with, each identified by a `name` and a `passPhrase` (a human-readable phrase of at least 5 words). Each AI user can have many **facts** — observations the AI records about them, each scored on a moral scale from -10 to 10.

This plan covers: schema, types/models, exceptions, DTOs, request services, controllers, routes, and the Drizzle service update. No migrations are generated — manual instructions are included.

---

## 1. Database Schema

**File:** `database/schema.ts`

Add two tables after the existing `users` table. Use the same column conventions (timestamps with timezone, `serial` PK, `defaultNow()`).

```ts
import { pgTable, serial, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core'

export const aiUsers = pgTable('ai_users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  passPhrase: varchar('pass_phrase', { length: 500 }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
})

export type AiUser = typeof aiUsers.$inferSelect
export type NewAiUser = typeof aiUsers.$inferInsert

export const userFacts = pgTable('user_facts', {
  id: serial('id').primaryKey(),
  aiUserId: integer('ai_user_id').notNull().references(() => aiUsers.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  moralScore: integer('moral_score').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
})

export type UserFact = typeof userFacts.$inferSelect
export type NewUserFact = typeof userFacts.$inferInsert
```

Key decisions:
- FK `ai_user_id` with `onDelete: 'cascade'` — deleting an AI user removes all their facts
- `moral_score` is an integer; range -10..10 is enforced at the Zod validation layer, not DB level
- `pass_phrase` column uses snake_case in DB (Drizzle convention for the column name string)

---

## 2. Models (re-export layer)

**New file:** `src/v1/models/AiUser.ts`
```ts
export { aiUsers, type AiUser, type NewAiUser } from '../../../database/schema'
```

**New file:** `src/v1/models/UserFact.ts`
```ts
export { userFacts, type UserFact, type NewUserFact } from '../../../database/schema'
```

Matches existing pattern in `src/v1/models/User.ts`.

---

## 3. Update CreateDrizzleService

**File:** `src/v1/config/CreateDrizzleService.ts`

Add `aiUsers` and `userFacts` to the schema import and the `drizzle()` call:

```ts
import { users, aiUsers, userFacts } from '../../../database/schema'
// ...
return drizzle(pool, { schema: { users, aiUsers, userFacts } })
```

This enables `db.query.aiUsers.findFirst(...)` and `db.query.userFacts.findFirst(...)`.

---

## 4. Error Handling

### 4a. Enum — `src/v1/enums/ResponseErrorCodeEnum.ts`

Add two values:
```ts
enum ResponseErrorCodeEnum {
  UNKNOWN = 'unknown',
  VALIDATION_ERROR = 'validation_error',
  AI_USER_NOT_FOUND = 'ai_user_not_found',
  USER_FACT_NOT_FOUND = 'user_fact_not_found',
}
```

### 4b. Exception — `src/v1/exceptions/AiUserNotFoundException.ts`

```ts
import { StatusCodes } from 'http-status-codes'
import ResponseErrorCodeEnum from '../enums/ResponseErrorCodeEnum'
import AbstractHttpResponseError from './AbstractHttpResponseError'

class AiUserNotFoundException extends AbstractHttpResponseError {
  constructor() {
    super(StatusCodes.NOT_FOUND, {
      code: ResponseErrorCodeEnum.AI_USER_NOT_FOUND,
      reason: 'AI User not found',
    })
  }
}
export default AiUserNotFoundException
```

### 4c. Exception — `src/v1/exceptions/UserFactNotFoundException.ts`

Same pattern, using `USER_FACT_NOT_FOUND` and `'User fact not found'`.

---

## 5. DTOs (Zod Schemas)

All in `src/v1/dtos/`. Each file exports a named schema constant + a default type export.

### 5a. `CreateAiUserRequestDto.ts`
```ts
import { z } from 'zod'

export const createAiUserRequestSchema = z.object({
  name: z.string().min(1),
  passPhrase: z
    .string()
    .refine((val) => val.trim().split(/\s+/).length >= 5, {
      message: 'Pass phrase must contain at least 5 words',
    }),
})

type CreateAiUserRequestDto = z.infer<typeof createAiUserRequestSchema>
export default CreateAiUserRequestDto
```

### 5b. `UpdateAiUserRequestDto.ts`
```ts
export const updateAiUserRequestSchema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().min(1).optional(),
  passPhrase: z
    .string()
    .refine((val) => val.trim().split(/\s+/).length >= 5, {
      message: 'Pass phrase must contain at least 5 words',
    })
    .optional(),
})
```
Uses merged params + body (id from params, fields from body).

### 5c. `AiUserParamsDto.ts`
```ts
export const aiUserParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
```

### 5d. `CreateUserFactRequestDto.ts`
```ts
export const createUserFactRequestSchema = z.object({
  userId: z.coerce.number().int().positive(),
  content: z.string().min(1),
  moralScore: z.number().int().min(-10).max(10),
})
```
`userId` comes from URL params, `content` + `moralScore` from body.

### 5e. `UpdateUserFactRequestDto.ts`
```ts
export const updateUserFactRequestSchema = z.object({
  userId: z.coerce.number().int().positive(),
  id: z.coerce.number().int().positive(),
  content: z.string().min(1).optional(),
  moralScore: z.number().int().min(-10).max(10).optional(),
})
```

### 5f. `UserFactParamsDto.ts`
```ts
export const userFactParamsSchema = z.object({
  userId: z.coerce.number().int().positive(),
  id: z.coerce.number().int().positive(),
})
```

### 5g. `GetUserFactsParamsDto.ts`
```ts
export const getUserFactsParamsSchema = z.object({
  userId: z.coerce.number().int().positive(),
})
```

---

## 6. Request Services

All in `src/v1/request-services/`. Each has a `handle(req: Request)` method.

| Service | Parses |
|---|---|
| `CreateAiUserRequestService` | `req.body` |
| `UpdateAiUserRequestService` | `{ ...req.params, ...req.body }` |
| `AiUserParamsRequestService` | `req.params` |
| `CreateUserFactRequestService` | `{ ...req.params, ...req.body }` |
| `UpdateUserFactRequestService` | `{ ...req.params, ...req.body }` |
| `UserFactParamsRequestService` | `req.params` |
| `GetUserFactsRequestService` | `req.params` |

---

## 7. Controllers

### 7a. AI Users — `src/v1/controllers/ai-users/`

| File | Method | Logic |
|---|---|---|
| `GetAiUsersController.ts` | `get` | `db.select().from(aiUsers)` → `200 { aiUsers: [...] }` |
| `GetSingleAiUserController.ts` | `get` | `db.query.aiUsers.findFirst({ where: eq(id) })` → throw `AiUserNotFoundException` if null → `200 { aiUser: {...} }` |
| `CreateAiUserController.ts` | `post` | `db.insert(aiUsers).values(dto).returning()` → `201 { aiUser: {...} }` |
| `UpdateAiUserController.ts` | `put` | `db.update(aiUsers).set({ ...fields, updatedAt: new Date() }).where(eq(id)).returning()` → throw `AiUserNotFoundException` if result empty → `200 { aiUser: {...} }` |
| `DeleteAiUserController.ts` | `delete` | `db.delete(aiUsers).where(eq(id)).returning()` → throw `AiUserNotFoundException` if result empty → `204` no body |

Each controller follows the exact pattern from `CreateUserController.ts`:
- `new XRequestService().handle(req)` for DTO
- `new CreateDrizzleService().handle()` for DB
- `try/catch(e: unknown) { next(e) }`

### 7b. User Facts — `src/v1/controllers/user-facts/`

| File | Method | Logic |
|---|---|---|
| `GetUserFactsController.ts` | `get` | `db.select().from(userFacts).where(eq(userFacts.aiUserId, userId))` → `200 { facts: [...] }` |
| `GetSingleUserFactController.ts` | `get` | `db.select().from(userFacts).where(and(eq(userFacts.id, id), eq(userFacts.aiUserId, userId)))` → throw `UserFactNotFoundException` if empty → `200 { fact: {...} }` |
| `CreateUserFactController.ts` | `post` | Verify parent AI user exists (throw `AiUserNotFoundException` if not) → `db.insert(userFacts).values({ aiUserId: userId, content, moralScore }).returning()` → `201 { fact: {...} }` |
| `UpdateUserFactController.ts` | `put` | `db.update(userFacts).set({ ...fields, updatedAt: new Date() }).where(and(eq(id), eq(aiUserId))).returning()` → throw `UserFactNotFoundException` if empty → `200 { fact: {...} }` |
| `DeleteUserFactController.ts` | `delete` | `db.delete(userFacts).where(and(eq(id), eq(aiUserId))).returning()` → throw `UserFactNotFoundException` if empty → `204` |

---

## 8. Routes

**File:** `src/v1/routes/index.ts`

Add after existing routes:

```ts
// AI Users
router.get('/ai-users', new GetAiUsersController().get)
router.get('/ai-users/:id', new GetSingleAiUserController().get)
router.post('/ai-users', new CreateAiUserController().post)
router.put('/ai-users/:id', new UpdateAiUserController().put)
router.delete('/ai-users/:id', new DeleteAiUserController().delete)

// User Facts (nested under AI users)
router.get('/ai-users/:userId/facts', new GetUserFactsController().get)
router.get('/ai-users/:userId/facts/:id', new GetSingleUserFactController().get)
router.post('/ai-users/:userId/facts', new CreateUserFactController().post)
router.put('/ai-users/:userId/facts/:id', new UpdateUserFactController().put)
router.delete('/ai-users/:userId/facts/:id', new DeleteUserFactController().delete)
```

---

## 9. Migration (Manual Steps)

**Do NOT generate or run migrations automatically.** After all schema changes are done:

1. Make sure Docker containers are running: `docker compose up`
2. Generate migration: `npm run db:generate`
   - This reads `database/schema.ts` and produces a new SQL file in `database/migrations/`
   - Review the generated SQL to confirm it creates `ai_users` and `user_facts` tables with the FK
3. Run migration: `npm run db:up`
   - Applies the pending migration to your PostgreSQL instance
4. Verify in Drizzle Studio: `npm run db:studio`
   - Confirm both tables exist with correct columns and the FK relationship

If you need to rollback: `npm run db:down`

---

## 10. Implementation Order

Execute in this sequence to avoid import errors:

1. `database/schema.ts` — add both tables + type exports
2. `src/v1/models/AiUser.ts` and `src/v1/models/UserFact.ts` — re-export layer
3. `src/v1/config/CreateDrizzleService.ts` — add new tables to schema object
4. `src/v1/enums/ResponseErrorCodeEnum.ts` — add new enum values
5. `src/v1/exceptions/AiUserNotFoundException.ts` and `UserFactNotFoundException.ts`
6. DTOs — all 7 files in `src/v1/dtos/`
7. Request services — all 7 files in `src/v1/request-services/`
8. Controllers — all 10 files in `src/v1/controllers/ai-users/` and `src/v1/controllers/user-facts/`
9. `src/v1/routes/index.ts` — register all 10 routes
10. **Manual:** generate and run migration (see section 9)

---

## 11. Verification

After implementation + migration:

```bash
# 1. Start the server
npm run dev

# 2. Test AI Users CRUD
curl -X POST http://localhost:3000/api/v1/ai-users \
  -H 'Content-Type: application/json' \
  -d '{"name": "John", "passPhrase": "the quick brown fox jumps"}'

curl http://localhost:3000/api/v1/ai-users
curl http://localhost:3000/api/v1/ai-users/1

curl -X PUT http://localhost:3000/api/v1/ai-users/1 \
  -H 'Content-Type: application/json' \
  -d '{"name": "John Updated"}'

# 3. Test User Facts CRUD
curl -X POST http://localhost:3000/api/v1/ai-users/1/facts \
  -H 'Content-Type: application/json' \
  -d '{"content": "Helped a stranger today", "moralScore": 8}'

curl http://localhost:3000/api/v1/ai-users/1/facts
curl http://localhost:3000/api/v1/ai-users/1/facts/1

curl -X PUT http://localhost:3000/api/v1/ai-users/1/facts/1 \
  -H 'Content-Type: application/json' \
  -d '{"moralScore": 9}'

curl -X DELETE http://localhost:3000/api/v1/ai-users/1/facts/1
curl -X DELETE http://localhost:3000/api/v1/ai-users/1

# 4. Test validation errors
curl -X POST http://localhost:3000/api/v1/ai-users \
  -H 'Content-Type: application/json' \
  -d '{"name": "Test", "passPhrase": "too short"}'
# Should return 400 with validation error about 5 words

curl -X POST http://localhost:3000/api/v1/ai-users/1/facts \
  -H 'Content-Type: application/json' \
  -d '{"content": "test", "moralScore": 15}'
# Should return 400 — moralScore out of range

# 5. Run existing tests to check nothing broke
npm test
```

---

## File Summary

| Action | Files |
|---|---|
| **Modified (4)** | `database/schema.ts`, `src/v1/config/CreateDrizzleService.ts`, `src/v1/enums/ResponseErrorCodeEnum.ts`, `src/v1/routes/index.ts` |
| **New models (2)** | `src/v1/models/AiUser.ts`, `src/v1/models/UserFact.ts` |
| **New exceptions (2)** | `src/v1/exceptions/AiUserNotFoundException.ts`, `src/v1/exceptions/UserFactNotFoundException.ts` |
| **New DTOs (7)** | `CreateAiUserRequestDto`, `UpdateAiUserRequestDto`, `AiUserParamsDto`, `CreateUserFactRequestDto`, `UpdateUserFactRequestDto`, `UserFactParamsDto`, `GetUserFactsParamsDto` |
| **New request services (7)** | One per DTO |
| **New controllers (10)** | 5 in `controllers/ai-users/`, 5 in `controllers/user-facts/` |
| **Total new files** | 28 |
