import { z } from 'zod'

export const updateAiUserRequestSchema = z
  .object({
    id: z.coerce.number().int().positive(),
    name: z.string().min(1).optional(),
    passPhrase: z
      .string()
      .refine((val) => val.trim().split(/\s+/).length >= 5, {
        message: 'Pass phrase must contain at least 5 words',
      })
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.passPhrase !== undefined, {
    message: 'At least one of name or passPhrase must be provided',
  })

type UpdateAiUserRequestDto = z.infer<typeof updateAiUserRequestSchema>

export default UpdateAiUserRequestDto
