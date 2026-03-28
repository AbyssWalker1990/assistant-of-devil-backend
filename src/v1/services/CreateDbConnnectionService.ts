import { green as info } from 'cli-color/bare'
import { Pool } from 'pg'

import ParseEnvVariablesService from './ParseEnvVariablesService'

class CreateDbConnectionService {
    constructor(private readonly parseEnvVariablesService = new ParseEnvVariablesService()) {}

    async handle(): Promise<void> {
        const {
            db: { host, port, user, password, database },
        } = this.parseEnvVariablesService.handle(process.env)

        const pool = new Pool({
            host,
            port,
            user,
            password,
            database,
        })

        try {
            await pool.query('SELECT 1')
            console.info(`🔌 ${info(`Successfully established PostgreSQL DB connection`)}  🔌`)
        } catch (err) {
            console.log(err)
        }
    }
}

export default CreateDbConnectionService
