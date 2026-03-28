import OpenAI from 'openai'
import ParseEnvVariablesService from '../../ParseEnvVariablesService'

/**
 * @throws inner/EnvVariableNotFoundException
 */
class CreateOpenAIClientService {
  constructor(private readonly parseEnvVariablesService = new ParseEnvVariablesService()) {}

  public handle(): OpenAI {
    const {
      openai: { key },
    } = this.parseEnvVariablesService.handle(process.env)

    return new OpenAI({ apiKey: key })
  }
}

export default CreateOpenAIClientService
