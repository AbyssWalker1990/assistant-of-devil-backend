import CreateOpenAIClientService from './CreateOpenAIClientService'

class SendMessageToAssistantService {
  constructor(private readonly createOpenAIClientService = new CreateOpenAIClientService()) {}

  public async handle(message: string = 'Count 1W + 10', previousResponseId?: string): Promise<string> {
    const openAIClient = this.createOpenAIClientService.handle()

    const response = await openAIClient.responses.create({
      model: 'gpt-4o',
      input: message,
      ...(previousResponseId && { previous_response_id: previousResponseId }),
      store: true,
    })

    console.log(response.output_text)

    return response.output_text
  }
}

export default SendMessageToAssistantService
