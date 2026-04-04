import { z } from 'zod'

export const getSingleUserRequestSchema = z.object({
  id: z.coerce.number().int().positive(),
})

type GetSingleUserRequestDto = z.infer<typeof getSingleUserRequestSchema>

export default GetSingleUserRequestDto
