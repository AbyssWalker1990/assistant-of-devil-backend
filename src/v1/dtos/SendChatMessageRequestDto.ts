import { z } from 'zod'

export const sendChatMessageRequestSchema = z.object({
  message: z.string().min(1),
  previousResponseId: z.string().optional(),
})

type SendChatMessageRequestDto = z.infer<typeof sendChatMessageRequestSchema>

export default SendChatMessageRequestDto
