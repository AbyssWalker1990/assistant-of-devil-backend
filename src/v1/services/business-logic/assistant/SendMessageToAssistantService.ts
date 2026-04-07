import { eq } from 'drizzle-orm'

import { aiUsers } from '../../../models/AiUser'
import { UserFact, userFacts } from '../../../models/UserFact'
import CreateDrizzleService from '../../../config/CreateDrizzleService'
import CreateOpenAIClientService from './CreateOpenAIClientService'
import BuildSystemInstructionsService from './BuildSystemInstructionsService'
import ProcessToolCallService from './ProcessToolCallService'
import identifyUserTool from '../../../constants/identifyUserTool'

export interface SendMessageResult {
  text: string
  responseId: string
  aiUserId?: number
  aiUserName?: string
  isNewUser?: boolean
  facts?: UserFact[]
}

class SendMessageToAssistantService {
  constructor(
    private readonly createOpenAIClientService = new CreateOpenAIClientService(),
    private readonly createDrizzleService = new CreateDrizzleService(),
    private readonly buildSystemInstructionsService = new BuildSystemInstructionsService(),
    private readonly processToolCallService = new ProcessToolCallService(),
  ) {}

  public async handle(
    message: string,
    previousResponseId?: string,
    aiUserId?: number,
  ): Promise<SendMessageResult> {
    const client = this.createOpenAIClientService.handle()

    let instructions: string
    if (aiUserId) {
      const db = this.createDrizzleService.handle()
      const aiUser = await db.query.aiUsers.findFirst({ where: eq(aiUsers.id, aiUserId) })
      const facts = aiUser
        ? await db.select().from(userFacts).where(eq(userFacts.aiUserId, aiUserId))
        : []
      instructions = this.buildSystemInstructionsService.handle(
        aiUser ? { userName: aiUser.name, facts } : undefined,
      )
    } else {
      instructions = this.buildSystemInstructionsService.handle()
    }

    const firstResponse = await client.responses.create({
      model: 'gpt-4o',
      instructions,
      input: message,
      ...(previousResponseId && { previous_response_id: previousResponseId }),
      ...(!aiUserId && { tools: [identifyUserTool] }),
      store: true,
    })

    if (!aiUserId) {
      const toolResult = await this.processToolCallService.handle(firstResponse)

      if (toolResult) {
        if (toolResult.identified) {
          return {
            text: toolResult.text,
            responseId: toolResult.responseId,
            aiUserId: toolResult.aiUserId,
            aiUserName: toolResult.aiUserName,
            isNewUser: toolResult.isNewUser,
            facts: toolResult.facts,
          }
        }
        return { text: toolResult.text, responseId: toolResult.responseId }
      }
    }

    return { text: firstResponse.output_text, responseId: firstResponse.id }
  }
}

export default SendMessageToAssistantService
