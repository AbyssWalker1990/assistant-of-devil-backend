import { z } from 'zod'

export const createAiUserRequestSchema = z.object({
  name: z.string().min(1),
  passPhrase: z
    .string()
    .refine((val) => val.trim().split(/\s+/).length >= 5, {
      message: 'Pass phrase must contain at least 5 words',
    }),
})

type CreateAiUserRequestDto = z.infer<typeof createAiUserRequestSchema>

export default CreateAiUserRequestDto
