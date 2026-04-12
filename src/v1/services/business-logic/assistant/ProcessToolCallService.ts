import OpenAI from 'openai'
import { z } from 'zod'

import { UserFact } from '../../../../../database/schema'
import CreateOpenAIClientService from './CreateOpenAIClientService'
import IdentifyUserService from './IdentifyUserService'
import BuildSystemInstructionsService from './BuildSystemInstructionsService'

const identifyUserArgsSchema = z.object({
  name: z.string().min(1),
  passPhrase: z.string().min(1),
})

export type ProcessToolCallResult =
  | {
      identified: true
      text: string
      responseId: string
      aiUserId: number
      aiUserName: string
      isNewUser: boolean
      facts: UserFact[]
    }
  | {
      identified: false
      text: string
      responseId: string
    }

class ProcessToolCallService {
  constructor(
    private readonly createOpenAIClientService = new CreateOpenAIClientService(),
    private readonly identifyUserService = new IdentifyUserService(),
    private readonly buildSystemInstructionsService = new BuildSystemInstructionsService(),
  ) {}

  public async handle(firstResponse: OpenAI.Responses.Response): Promise<ProcessToolCallResult | null> {
    const toolCallItem = firstResponse.output.find(
      (item): item is OpenAI.Responses.ResponseFunctionToolCall => item.type === 'function_call',
    )

    if (!toolCallItem) return null

    const parsed = identifyUserArgsSchema.safeParse(JSON.parse(toolCallItem.arguments))
    if (!parsed.success) {
      const client = this.createOpenAIClientService.handle()
      const errorResponse = await client.responses.create({
        model: 'gpt-4o',
        previous_response_id: firstResponse.id,
        input: [
          {
            type: 'function_call_output',
            call_id: toolCallItem.call_id,
            output: JSON.stringify({
              status: 'error',
              message: `Invalid tool call arguments: ${parsed.error.issues.map((i) => i.message).join(', ')}`,
            }),
          },
        ],
        store: true,
      })
      return { identified: false, text: errorResponse.output_text, responseId: errorResponse.id }
    }
    const { name, passPhrase } = parsed.data
    const client = this.createOpenAIClientService.handle()

    const wordCount = passPhrase.trim().split(/\s+/).length
    if (wordCount < 5) {
      const errorResponse = await client.responses.create({
        model: 'gpt-4o',
        previous_response_id: firstResponse.id,
        input: [
          {
            type: 'function_call_output',
            call_id: toolCallItem.call_id,
            output: JSON.stringify({
              status: 'error',
              message: 'The pass phrase is too short — it must be at least 5 words. Ask the user to provide a longer one.',
            }),
          },
        ],
        store: true,
      })
      return { identified: false, text: errorResponse.output_text, responseId: errorResponse.id }
    }

    const { aiUser, facts, isNewUser } = await this.identifyUserService.handle(name, passPhrase)

    const toolOutput = isNewUser
      ? {
          status: 'new_user',
          name: aiUser.name,
          message:
            'This is a brand new soul — no history with you yet. Welcome them in your darkly theatrical way. Make it feel like a ritual initiation.',
        }
      : {
          status: 'returning_user',
          name: aiUser.name,
          facts: facts.map((f) => ({ content: f.content, moralScore: f.moralScore })),
          message:
            'This soul has returned. You remember them. React as though you recognise them — reference their history if fitting. Make it clear you never forget.',
        }

    const postInstructions = this.buildSystemInstructionsService.handle({ userName: aiUser.name, facts })

    const secondResponse = await client.responses.create({
      model: 'gpt-4o',
      instructions: postInstructions,
      previous_response_id: firstResponse.id,
      input: [
        {
          type: 'function_call_output',
          call_id: toolCallItem.call_id,
          output: JSON.stringify(toolOutput),
        },
      ],
      store: true,
    })

    return {
      identified: true,
      text: secondResponse.output_text,
      responseId: secondResponse.id,
      aiUserId: aiUser.id,
      aiUserName: aiUser.name,
      isNewUser,
      facts,
    }
  }
}

export default ProcessToolCallService
