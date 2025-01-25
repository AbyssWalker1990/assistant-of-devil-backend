type AppEnvType = {
  app: {
    port: number
  }
  db: {
    type: string
    host: string
    port: number
    username: string
    password: string
    database: string
  }

  openai: {
    apiKey: string
  }
}

export default AppEnvType
