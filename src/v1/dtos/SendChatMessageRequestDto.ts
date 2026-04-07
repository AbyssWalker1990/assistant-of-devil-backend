import { z } from 'zod'

export const sendChatMessageRequestSchema = z.object({
  message: z.string().min(1),
  previousResponseId: z.string().optional(),
  aiUserId: z.number().int().positive().optional(),
})

type SendChatMessageRequestDto = z.infer<typeof sendChatMessageRequestSchema>

export default SendChatMessageRequestDto
