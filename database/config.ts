require('dotenv').config()

interface DatabaseConfig {
  username: string
  password: string
  database: string
  host: string
  port: number
  dialect: 'postgres'
  logging: boolean | ((sql: string, timing?: number) => void)
}

interface Config {
  development: DatabaseConfig
  production: DatabaseConfig
}

const config: Config = {
  development: {
    username: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
    host: process.env.POSTGRES_HOST!,
    port: Number(process.env.POSTGRES_PORT),
    dialect: 'postgres',
    logging: console.log,
  },
  production: {
    username: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
    host: process.env.POSTGRES_HOST!,
    port: Number(process.env.POSTGRES_PORT),
    dialect: 'postgres',
    logging: false,
  },
}

module.exports = config
