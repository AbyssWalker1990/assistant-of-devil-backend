import { green as info } from 'cli-color/bare'
import { DataSource } from 'typeorm'

import AppEnvType from '../types/AppEnvType'
import ParseEnvVariablesService from './ParseEnvVariablesService'

class CreateDbConnectionService {
    constructor(private readonly parseEnvVariablesService = new ParseEnvVariablesService()) {}

    async handle(): Promise<void> {
        const {
            db: { host, port, username, password, database },
        } = this.parseEnvVariablesService.handle(process.env)

        const dataSource = new DataSource({
            type: 'mysql',
            host,
            port,
            username,
            password,
            database,
            entities: [],
            synchronize: true,
        })

        try {
            await dataSource.initialize()
            console.info(`🔌 ${info(`Successfully established MySQL DB connection`)}  🔌`)
        } catch (err) {
            console.log(err)
        }
    }
}

export default CreateDbConnectionService
