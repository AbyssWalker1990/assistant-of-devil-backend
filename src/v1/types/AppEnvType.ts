type AppEnvType = {
    app: {
        port: number
    }
    db: {
        host: string
        port: number
        user: string
        password: string
        database: string
    }
    openai: {
        key: string
    }
}

export default AppEnvType