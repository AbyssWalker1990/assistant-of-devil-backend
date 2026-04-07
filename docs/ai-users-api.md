# AI Users & Facts — API Reference

Base URL: `http://localhost:3001/api/v1`

All request bodies are JSON. All responses are JSON.

---

## AI Users

### List all AI users

```
GET /ai-users
```

**Response 200**
```json
{
  "aiUsers": [
    {
      "id": 1,
      "name": "Alice",
      "passPhrase": "the quick brown fox jumps",
      "createdAt": "2026-04-04T10:00:00.000Z",
      "updatedAt": "2026-04-04T10:00:00.000Z"
    }
  ]
}
```

---

### Get a single AI user

```
GET /ai-users/:id
```

**Response 200**
```json
{
  "aiUser": {
    "id": 1,
    "name": "Alice",
    "passPhrase": "the quick brown fox jumps",
    "createdAt": "2026-04-04T10:00:00.000Z",
    "updatedAt": "2026-04-04T10:00:00.000Z"
  }
}
```

**Response 404**
```json
{ "code": "ai_user_not_found", "reason": "AI User not found" }
```

---

### Create an AI user

```
POST /ai-users
Content-Type: application/json
```

**Body**
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | non-empty |
| `passPhrase` | string | yes | at least 5 words |

```json
{
  "name": "Alice",
  "passPhrase": "the quick brown fox jumps"
}
```

**Response 201**
```json
{
  "aiUser": {
    "id": 1,
    "name": "Alice",
    "passPhrase": "the quick brown fox jumps",
    "createdAt": "2026-04-04T10:00:00.000Z",
    "updatedAt": "2026-04-04T10:00:00.000Z"
  }
}
```

**Response 400** — passPhrase has fewer than 5 words
```json
{
  "code": "validation_error",
  "reason": "Bad Request",
  "errors": [{ "message": "Pass phrase must contain at least 5 words", ... }]
}
```

---

### Update an AI user

```
PUT /ai-users/:id
Content-Type: application/json
```

**Body** — at least one field required
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | no | non-empty |
| `passPhrase` | string | no | at least 5 words |

```json
{
  "name": "Alice Updated"
}
```

**Response 200**
```json
{
  "aiUser": {
    "id": 1,
    "name": "Alice Updated",
    "passPhrase": "the quick brown fox jumps",
    "createdAt": "2026-04-04T10:00:00.000Z",
    "updatedAt": "2026-04-04T11:00:00.000Z"
  }
}
```

**Response 404**
```json
{ "code": "ai_user_not_found", "reason": "AI User not found" }
```

---

### Delete an AI user

```
DELETE /ai-users/:id
```

Deletes the user and **all their facts** (cascade).

**Response 204** — no body

**Response 404**
```json
{ "code": "ai_user_not_found", "reason": "AI User not found" }
```

---

## User Facts

Facts belong to an AI user. All fact endpoints are nested under `/ai-users/:userId/facts`.
The `userId` in the URL must match the fact's owner — a fact from another user returns 404.

### List all facts for a user

```
GET /ai-users/:userId/facts
```

**Response 200**
```json
{
  "facts": [
    {
      "id": 1,
      "aiUserId": 1,
      "content": "Helped a stranger without being asked",
      "moralScore": 8,
      "createdAt": "2026-04-04T10:00:00.000Z",
      "updatedAt": "2026-04-04T10:00:00.000Z"
    }
  ]
}
```

---

### Get a single fact

```
GET /ai-users/:userId/facts/:id
```

**Response 200**
```json
{
  "fact": {
    "id": 1,
    "aiUserId": 1,
    "content": "Helped a stranger without being asked",
    "moralScore": 8,
    "createdAt": "2026-04-04T10:00:00.000Z",
    "updatedAt": "2026-04-04T10:00:00.000Z"
  }
}
```

**Response 404**
```json
{ "code": "user_fact_not_found", "reason": "User fact not found" }
```

---

### Create a fact

```
POST /ai-users/:userId/facts
Content-Type: application/json
```

**Body**
| Field | Type | Required | Notes |
|---|---|---|---|
| `content` | string | yes | the fact statement |
| `moralScore` | integer | yes | -10 to 10 inclusive |

`moralScore` meaning:
- `-10` to `-1` — morally negative
- `0` — neutral
- `1` to `10` — morally positive

```json
{
  "content": "Helped a stranger without being asked",
  "moralScore": 8
}
```

**Response 201**
```json
{
  "fact": {
    "id": 1,
    "aiUserId": 1,
    "content": "Helped a stranger without being asked",
    "moralScore": 8,
    "createdAt": "2026-04-04T10:00:00.000Z",
    "updatedAt": "2026-04-04T10:00:00.000Z"
  }
}
```

**Response 404** — userId does not exist
```json
{ "code": "ai_user_not_found", "reason": "AI User not found" }
```

**Response 400** — moralScore out of range
```json
{
  "code": "validation_error",
  "reason": "Bad Request",
  "errors": [{ "message": "Number must be less than or equal to 10", ... }]
}
```

---

### Update a fact

```
PUT /ai-users/:userId/facts/:id
Content-Type: application/json
```

**Body** — at least one field required
| Field | Type | Required | Notes |
|---|---|---|---|
| `content` | string | no | |
| `moralScore` | integer | no | -10 to 10 |

```json
{
  "moralScore": 9
}
```

**Response 200**
```json
{
  "fact": {
    "id": 1,
    "aiUserId": 1,
    "content": "Helped a stranger without being asked",
    "moralScore": 9,
    "createdAt": "2026-04-04T10:00:00.000Z",
    "updatedAt": "2026-04-04T11:00:00.000Z"
  }
}
```

**Response 404**
```json
{ "code": "user_fact_not_found", "reason": "User fact not found" }
```

---

### Delete a fact

```
DELETE /ai-users/:userId/facts/:id
```

**Response 204** — no body

**Response 404**
```json
{ "code": "user_fact_not_found", "reason": "User fact not found" }
```

---

## Error Reference

| `code` | HTTP | Meaning |
|---|---|---|
| `ai_user_not_found` | 404 | No AI user with that id |
| `user_fact_not_found` | 404 | No fact with that id under that user |
| `validation_error` | 400 | Invalid request body or params (see `errors` array) |
| `unknown` | 500 | Unexpected server error |
