import { z } from 'zod'

export const updateUserFactRequestSchema = z.object({
  userId: z.coerce.number().int().positive(),
  id: z.coerce.number().int().positive(),
  content: z.string().min(1).optional(),
  moralScore: z.number().int().min(-10).max(10).optional(),
})

type UpdateUserFactRequestDto = z.infer<typeof updateUserFactRequestSchema>

export default UpdateUserFactRequestDto
