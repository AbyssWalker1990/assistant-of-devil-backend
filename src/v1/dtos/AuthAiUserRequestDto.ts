import { z } from 'zod'

export const authAiUserRequestSchema = z.object({
  name: z.string().min(1),
  passPhrase: z
    .string()
    .refine((val) => val.trim().split(/\s+/).length >= 5, {
      message: 'Pass phrase must contain at least 5 words',
    }),
})

type AuthAiUserRequestDto = z.infer<typeof authAiUserRequestSchema>

export default AuthAiUserRequestDto
