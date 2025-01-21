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
}

export default AppEnvType