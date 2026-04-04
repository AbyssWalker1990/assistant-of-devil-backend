import { z } from 'zod'

export const createUserRequestSchema = z.object({
  name: z.string().min(1),
  birthdate: z.coerce.date().optional(),
  country: z.string().optional(),
})

type CreateUserRequestDto = z.infer<typeof createUserRequestSchema>

export default CreateUserRequestDto
