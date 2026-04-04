import CreateOpenAIClientService from './CreateOpenAIClientService'

class SendMessageToAssistantService {
  constructor(private readonly createOpenAIClientService = new CreateOpenAIClientService()) {}

  public async handle(
    message: string = 'Count 1W + 10',
    previousResponseId?: string,
  ): Promise<{ text: string; responseId: string }> {
    console.log(`Sending message to assistant: ${message}, previousResponseId: ${previousResponseId}`)
    const openAIClient = this.createOpenAIClientService.handle()

    const response = await openAIClient.responses.create({
      model: 'gpt-4o',
      input: message,
      ...(previousResponseId && { previous_response_id: previousResponseId }),
      store: true,
    })

    console.log(`Received response from assistant: ${response.output_text}, responseId: ${response.id}`)

    return { text: response.output_text, responseId: response.id }
  }
}

export default SendMessageToAssistantService
