import { NextFunction, Request, Response } from 'express'

import AskAssistantRequestService from '../services/assistant/AskAssistantRequestService'
import LogErrorService from '../services/LogErrorService'

class AskAssistantController {
    async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto = await new AskAssistantRequestService().handle(req)
            console.log(dto)
            const { status, payload } = { status: 200, payload: { question: dto.question, id: dto.assistantThreadId } }

            res.status(status).json(payload)
        } catch (e: unknown) {
            new LogErrorService().handle(e, req)

            next(e)
        }
    }
}

export default AskAssistantController
