import EnvVariableNotFoundException from '../exceptions/inner/EnvVariableNotFoundException'
import AppEnvType from '../types/AppEnvType'

class ParseEnvVariablesService {
  /**
   * @throws inner/EnvVariableNotFoundException
   */
  public handle(env: NodeJS.ProcessEnv): AppEnvType {
    const { getOrFail } = this

    const app = {
      port: Number(getOrFail(env, 'API_INSIDE_PORT')),
    }

    const db = {
      host: getOrFail(env, 'POSTGRES_HOST'),
      port: Number(getOrFail(env, 'POSTGRES_PORT')),
      user: getOrFail(env, 'POSTGRES_USER'),
      password: getOrFail(env, 'POSTGRES_PASSWORD'),
      database: getOrFail(env, 'POSTGRES_DB'),
    }

    const openai = {
      key: getOrFail(env, 'OPEN_AI_API_KEY'),
    }

    return {
      app,
      db,
      openai,
    }
  }

  /**
   * @throws inner/EnvVariableNotFoundException
   */
  private getOrFail(env: NodeJS.ProcessEnv, name: string): string {
    const value = env[name]
    if (value === undefined) {
      throw new EnvVariableNotFoundException()
    }

    return value
  }
}

export default ParseEnvVariablesService
