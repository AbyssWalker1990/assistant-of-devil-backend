import OpenAI from 'openai'

import GetEnvVariablesService from './GetEnvVariablesService'

class CreateOpenAIClientService {
    constructor(private readonly getEnvVariablesService = new GetEnvVariablesService()) {}

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
