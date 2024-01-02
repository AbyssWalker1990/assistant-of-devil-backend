import { bold, red as error } from 'cli-color'
import { Request } from 'express'
import moment from 'moment/moment'

class LogErrorService {
    public handle(e: unknown, req: Request): void {
        const dateTime = moment().format('YYYY-MM-DD HH:mm:ss')

        console.error(`[❗] ${error('ERROR')} [❗] \n`)

        console.error(`${dateTime} \n`)

        console.error(e)

        console.error(`\n ${bold(req.originalUrl)} \n`)
    }
}

export default LogErrorService
