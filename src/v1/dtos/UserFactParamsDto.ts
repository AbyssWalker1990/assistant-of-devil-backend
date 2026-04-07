import { z } from 'zod'

export const userFactParamsSchema = z.object({
  userId: z.coerce.number().int().positive(),
  id: z.coerce.number().int().positive(),
})

type UserFactParamsDto = z.infer<typeof userFactParamsSchema>

export default UserFactParamsDto
