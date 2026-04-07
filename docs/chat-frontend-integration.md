# Chat API — Frontend Integration Guide

## Overview

The chat endpoint handles the full lifecycle of a conversation: initial greeting, user identification, and ongoing dialogue. There is a single endpoint for all of this. The frontend tracks two pieces of state (`previousResponseId` and `aiUserId`) to know where the conversation is and who the user is.

The AI will automatically ask for the user's name and pass phrase on first contact. Once the user provides them, the backend looks them up (or creates a new account) and returns identification data. No separate login endpoint exists.

---

## Endpoint

```
POST /api/v1/chat/messages
Content-Type: application/json
```

### Request body

| Field                | Type     | Required | Description                                                                         |
| -------------------- | -------- | -------- | ----------------------------------------------------------------------------------- |
| `message`            | `string` | Yes      | The user's message text (min 1 char)                                                |
| `previousResponseId` | `string` | No       | The `responseId` from the previous API response. Omit on the very first message.    |
| `aiUserId`           | `number` | No       | The user's ID returned after identification. Omit until identification is complete. |

### Response body

| Field        | Type         | Always present         | Description                                                        |
| ------------ | ------------ | ---------------------- | ------------------------------------------------------------------ |
| `response`   | `string`     | Yes                    | The AI's text reply to show in the chat                            |
| `responseId` | `string`     | Yes                    | Store this and send it as `previousResponseId` on the next request |
| `aiUserId`   | `number`     | Only on identification | The user's ID. Store permanently for the session.                  |
| `aiUserName` | `string`     | Only on identification | The user's name as stored in the DB                                |
| `isNewUser`  | `boolean`    | Only on identification | `true` = just registered, `false` = returning user                 |
| `facts`      | `UserFact[]` | Only on identification | The user's known facts. Empty array for new users.                 |

`UserFact` shape:

```typescript
{
  id: number
  aiUserId: number
  content: string
  moralScore: number // -10 to 10
  createdAt: string
  updatedAt: string
}
```

---

## Frontend State

Track this in your state manager (Redux, Zustand, useState, etc.):

```typescript
interface ChatState {
  phase: 'identifying' | 'identified'
  previousResponseId: string | null
  aiUserId: number | null
  aiUserName: string | null
  isNewUser: boolean | null
  facts: UserFact[]
  messages: { role: 'user' | 'assistant'; text: string }[]
}
```

Initial state:

```typescript
{
  phase: 'identifying',
  previousResponseId: null,
  aiUserId: null,
  aiUserName: null,
  isNewUser: null,
  facts: [],
  messages: []
}
```

---

## Conversation Flow

### Phase 1 — Identifying

Before the user is identified, send messages **without** `aiUserId`. The AI will ask for name and pass phrase. Keep sending messages this way until the response contains `aiUserId`.

```typescript
// Request — identifying phase
{
  "message": "hello",
  "previousResponseId": null  // omit or null on first message
}

// Response — AI asks for credentials
{
  "response": "Ah, another soul dares to knock... Who are you, and what is your pass phrase?",
  "responseId": "resp_abc123"
}
```

```typescript
// Request — user provides credentials
{
  "message": "My name is Alice and my pass phrase is dancing shadows in the midnight rain",
  "previousResponseId": "resp_abc123"
}

// Response — identification complete (returning user)
{
  "response": "Alice... I remember you. You were here before, weren't you?",
  "responseId": "resp_def456",
  "aiUserId": 7,
  "aiUserName": "Alice",
  "isNewUser": false,
  "facts": [
    { "id": 1, "aiUserId": 7, "content": "Tends to deflect with humour", "moralScore": -2, ... }
  ]
}

// Response — identification complete (new user)
{
  "response": "A fresh soul steps into the dark... Welcome, Bob. I shall be watching.",
  "responseId": "resp_ghi789",
  "aiUserId": 12,
  "aiUserName": "Bob",
  "isNewUser": true,
  "facts": []
}
```

When you receive a response with `aiUserId`:

1. Set `phase = 'identified'`
2. Store `aiUserId`, `aiUserName`, `isNewUser`, `facts`
3. Update `previousResponseId`

### Phase 2 — Identified

Once `aiUserId` is stored, include it in every subsequent request:

```typescript
// Request — identified phase
{
  "message": "So what do you think of me?",
  "previousResponseId": "resp_def456",
  "aiUserId": 7
}

// Response — normal chat
{
  "response": "Honestly? I've seen better...",
  "responseId": "resp_jkl012"
}
```

---

## Implementation Pseudocode

```typescript
async function sendMessage(text: string): Promise<void> {
  addToMessages({ role: 'user', text })

  const body: Record<string, unknown> = { message: text }
  if (state.previousResponseId) body.previousResponseId = state.previousResponseId
  if (state.aiUserId) body.aiUserId = state.aiUserId

  const res = await fetch('/api/v1/chat/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  addToMessages({ role: 'assistant', text: data.response })
  state.previousResponseId = data.responseId

  if (data.aiUserId !== undefined && state.phase !== 'identified') {
    state.phase = 'identified'
    state.aiUserId = data.aiUserId
    state.aiUserName = data.aiUserName
    state.isNewUser = data.isNewUser
    state.facts = data.facts ?? []
    // trigger any "welcome" UI here
  }
}
```

---

## Error Responses

All errors follow this shape:

```typescript
{ "code": string, "reason": string }
```

| HTTP | `code`               | When                                                                 |
| ---- | -------------------- | -------------------------------------------------------------------- |
| 400  | `"validation_error"` | Missing/invalid request fields. Also includes `"errors": ZodIssue[]` |
| 500  | `"unknown"`          | Unexpected server or OpenAI error                                    |

The 400 also includes a `errors` array with Zod validation details.

---

## Key Behaviours to Know

**Pass phrase requirements:** The AI is instructed to ask for a pass phrase of at least 5 words. If the user provides fewer than 5 words, the AI will ask them to try again — no identification will occur that turn.

**Case-insensitive matching:** Names and pass phrases are matched case-insensitively. "Alice" and "alice" are the same person. "Dancing in the Rain" and "dancing in the rain" are the same pass phrase.

**Same name, different pass phrase = different user.** If a user provides an existing name but the wrong pass phrase, a new account is created. There is no "wrong password" error — every unique name+passphrase combination is its own identity.

**Re-identification is blocked.** Once `aiUserId` is set and sent with requests, the AI will refuse any attempts to change identity mid-conversation. The tool for identification is not available post-identification.

**The `facts` array is only returned at the moment of identification.** Subsequent chat responses will not re-include it. Store it after identification if you need to display it.

**Session persistence:** The conversation is stateless on the server. You must preserve `previousResponseId` and `aiUserId` across page reloads (e.g., `sessionStorage` or `localStorage`) if you want conversations to survive navigation.

---

## TypeScript Types

```typescript
interface UserFact {
  id: number
  aiUserId: number
  content: string
  moralScore: number
  createdAt: string
  updatedAt: string
}

interface ChatRequest {
  message: string
  previousResponseId?: string
  aiUserId?: number
}

interface ChatResponse {
  response: string
  responseId: string
  aiUserId?: number
  aiUserName?: string
  isNewUser?: boolean
  facts?: UserFact[]
}
```

How it works end-to-end:

1. Frontend sends first message → no aiUserId → backend uses pre-identification prompt + includes identify_user tool
2. AI asks for name + pass phrase conversationally
3. User provides them → AI calls the tool → ProcessToolCallService does the DB lookup/create → makes second OpenAI call with the
   result → AI responds as new or returning user
4. Response includes aiUserId, isNewUser, facts → frontend stores these
5. All subsequent messages include aiUserId → tool is omitted, post-identification prompt with user facts is used
