import OpenAI from 'openai'

import ParseEnvVariablesService from '../services/ParseEnvVariablesService'

class CreateOpenAIClientService {
  constructor(private readonly getEnvVariablesService = new ParseEnvVariablesService()) {}

  /**
   * @throws inner/EnvVariableNotFoundError
   */
  public handle(): OpenAI {
    const {
      openai: { key },
    } = this.getEnvVariablesService.handle(process.env)

    const configuration = {
      apiKey: key,
    }

    return new OpenAI(configuration)
  }
}

export default CreateOpenAIClientService
