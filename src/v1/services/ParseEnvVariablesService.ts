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
      type: 'mysql',
      host: getOrFail(env, 'MYSQL_HOST'),
      port: Number(getOrFail(env, 'MYSQL_PORT')),
      username: getOrFail(env, 'MYSQL_USER'),
      password: getOrFail(env, 'MYSQL_PASSWORD'),
      database: getOrFail(env, 'MYSQL_DATABASE'),
    }

    const openai = {
      apiKey: getOrFail(env, 'OPENAI_API_KEY'),
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
