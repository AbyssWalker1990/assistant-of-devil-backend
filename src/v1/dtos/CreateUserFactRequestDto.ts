import { z } from 'zod'

export const createUserFactRequestSchema = z.object({
  userId: z.coerce.number().int().positive(),
  content: z.string().min(1),
  moralScore: z.number().int().min(-10).max(10),
})

type CreateUserFactRequestDto = z.infer<typeof createUserFactRequestSchema>

export default CreateUserFactRequestDto
