import EnvVariableNotFoundError from '../errors/inner/EnvVariableNotFoundError'
import AppEnvType from '../types/AppEnvType'

class GetEnvVariablesService {
    /**
     * @throws inner/EnvVariableNotFoundError
     */
    public handle(env: NodeJS.ProcessEnv): AppEnvType {
        const app = {
            port: Number(this.getOrFail(env, 'API_INSIDE_PORT')),
        }

        const db = {
            host: this.getOrFail(env, 'POSTGRES_DB_HOST'),
            port: Number(this.getOrFail(env, 'POSTGRES_PORT')),
            user: this.getOrFail(env, 'POSTGRES_USER'),
            password: this.getOrFail(env, 'POSTGRES_PASSWORD'),
            database: this.getOrFail(env, 'POSTGRES_DB'),
        }

        return {
            app,
            db
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
