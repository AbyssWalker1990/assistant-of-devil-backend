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
}

export default AppEnvType