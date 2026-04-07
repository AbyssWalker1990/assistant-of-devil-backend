import { z } from 'zod'

export const aiUserParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

type AiUserParamsDto = z.infer<typeof aiUserParamsSchema>

export default AiUserParamsDto
