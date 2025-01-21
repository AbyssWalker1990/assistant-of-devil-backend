import EnvVariableNotFoundError from '../exceptions/inner/EnvVariableNotFoundError'
import AppEnvType from '../types/AppEnvType'

class GetEnvVariablesService {
    /**
     * @throws inner/EnvVariableNotFoundError
     */
    public handle(env: NodeJS.ProcessEnv): AppEnvType {
        const app = {
            port: Number(this.getOrFail(env, 'API_INSIDE_PORT')),
        }

        return {
            app,
        }
    }

    /**
     * @throws inner/EnvVariableNotFoundError
     */
    private getOrFail(env: NodeJS.ProcessEnv, name: string): string {
        const value = env[name]
        if (value === undefined) {
            throw new EnvVariableNotFoundError()
        }

        return value
    }
}

export default GetEnvVariablesService
