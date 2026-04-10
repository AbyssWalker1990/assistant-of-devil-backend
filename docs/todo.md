# TODO

## Critical

- [x] Hash pass phrases before storage (bcrypt/argon2) and update lookup to compare against hash — `database/schema.ts`, `IdentifyUserService.ts`
- [x] Exclude `passPhrase` from all API responses (SELECT only needed columns or strip before returning) — `GetAiUsersController.ts`, `GetSingleAiUserController.ts`
- [ ] Add authentication middleware to all `/ai-users` and `/ai-users/:userId/facts` routes — `src/v1/routes/index.ts`
- [ ] Fix TOCTOU race in user identification — use `INSERT ... ON CONFLICT DO NOTHING RETURNING` or wrap find+insert in a transaction — `IdentifyUserService.ts`

## Important

- [x] Make Drizzle/pg Pool a singleton — create once at app startup and share across the app instead of `new CreateDrizzleService().handle()` per request
- [ ] Require at least one field in `UpdateAiUserRequestDto` — add `.refine()` to reject empty update bodies — `src/v1/dtos/UpdateAiUserRequestDto.ts`
- [ ] Validate AI tool call arguments at runtime (Zod or manual type checks) instead of blind `JSON.parse` cast — `ProcessToolCallService.ts:38`
- [ ] Replace `if (aiUserId)` with `if (aiUserId !== undefined)` — `SendMessageToAssistantService.ts:35`

## Refactoring

- [ ] Remove empty model re-export files (`src/v1/models/AiUser.ts`, `src/v1/models/UserFact.ts`) and import directly from `database/schema.ts`
- [ ] Extract DB fetch logic out of `SendMessageToAssistantService` into a dedicated service (e.g. `FetchUserContextService`)
- [ ] Fix DB column names to use `snake_case` (e.g. `'created_at'` instead of `'createdAt'`) in schema — `database/schema.ts`
