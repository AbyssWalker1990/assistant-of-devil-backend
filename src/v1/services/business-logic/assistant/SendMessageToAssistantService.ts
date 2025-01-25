import CreateOpenAIClientService from './CreateOpenAIClientService'
import { MessageContent } from 'openai/resources/beta/threads/messages'

class SendMessageToAssistantService {
  constructor(private readonly createOpenAIClientService = new CreateOpenAIClientService()) {}
  public async handle(message: string = 'Count 1 + 10'): Promise<Array<MessageContent>> {
    const openAIClient = await this.createOpenAIClientService.handle()

    const thread = await openAIClient.beta.threads.create()
    const answer = await openAIClient.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message,
    })

    console.log(answer.content)

    return answer.content
  }
}

export default SendMessageToAssistantService
