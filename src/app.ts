import { green } from 'cli-color'
import express from 'express'
import cors from 'cors'

import ErrorMiddleware from './v1/middlewares/ErrorMiddleware'
import v1Router from './v1/routes'
import AppEnvType from './v1/types/AppEnvType'
import { sql } from 'drizzle-orm'
import db from './v1/config/db'

class App {
  constructor(
    private appEnv: AppEnvType,
    private app = express(),
  ) {
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeErrorHandler()
    this.connectToDatabase()
  }

  public listen(): void {
    this.app.listen(this.appEnv.app.port, () => {
      console.info(`🧌   ${green(`App listening on the port ${this.appEnv.app.port}`)}  🧌`)
    })
  }

  private initializeMiddlewares(): void {
    this.app.use(
      cors({
        origin: '*',
        credentials: true,
      }),
    )

    this.app.use(express.json())
  }

  private initializeRoutes(): void {
    this.app.use('/api/v1', v1Router)
  }

  private initializeErrorHandler(): void {
    this.app.use(new ErrorMiddleware().run)
  }

  private async connectToDatabase(): Promise<void> {
    await db.execute(sql`SELECT 1`)
  }
}

export default App
