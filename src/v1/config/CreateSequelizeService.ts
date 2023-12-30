import { Sequelize } from 'sequelize'
import GetEnvVariablesService from './GetEnvVariablesService';

class CreateSequelizeService {
    constructor(private getEnvVariablesService = new GetEnvVariablesService()) {}

    public handle(): Sequelize {
        const { db } = this.getEnvVariablesService.handle(process.env)

        const sequelize = new Sequelize({
            dialect: 'postgres',
            host: 'db',
            port: db.port,
            database: db.database,
            username: db.user,
            password: db.password
        })

        return sequelize
    }
}

export default CreateSequelizeService