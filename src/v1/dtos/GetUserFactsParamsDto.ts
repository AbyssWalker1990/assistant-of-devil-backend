import { z } from 'zod'

export const getUserFactsParamsSchema = z.object({
  userId: z.coerce.number().int().positive(),
})

type GetUserFactsParamsDto = z.infer<typeof getUserFactsParamsSchema>

export default GetUserFactsParamsDto
