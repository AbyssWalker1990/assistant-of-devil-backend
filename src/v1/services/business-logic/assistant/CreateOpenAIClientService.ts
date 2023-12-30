import { OpenAI } from 'openai'
import ParseEnvVariablesService from '../../ParseEnvVariablesService'

/**
 * @throws inner/EnvVariableNotFoundException
 */
class CreateOpenAIClientService {
  constructor(private readonly parseEnvVariablesService = new ParseEnvVariablesService()) {}

  public async handle(): Promise<OpenAI> {
    const {
      openai: { apiKey },
    } = this.parseEnvVariablesService.handle(process.env)

    const openAIClient = new OpenAI({ apiKey })

    return openAIClient
  }
}

export default CreateOpenAIClientService
