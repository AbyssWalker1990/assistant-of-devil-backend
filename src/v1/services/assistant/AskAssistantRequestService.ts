import { Request } from 'express'

import AskAssistantRequestServiceDto from '../../dtos/AskAssistantRequestServiceDto'
import HttpRequestServiceInterface from '../../interfaces/HttpRequestServiceInterface'
import AskAssistantRequestServiceDtoMapper from '../../mappers/AskAssistantRequestServiceDtoMapper'
import GetAssistantThreadIdService from './parameter-validation/GetAssistantThreadIdService'
import GetAssistantQuestionService from './parameter-validation/GetAssistantQuestionService'

class AskAssistantRequestService implements HttpRequestServiceInterface {
    constructor(
        public readonly getAssistantThreadIdService = new GetAssistantThreadIdService(),
        public readonly getAssistantQuestionService = new GetAssistantQuestionService(),
        public readonly askAssistantRequestServiceDtoMapper = new AskAssistantRequestServiceDtoMapper(),
    ) {}

    /**
     * @throws parameter-validation/AssistantThreadIdInvalidError
     * @throws parameter-validation/AssistantQuestionInvalidError
     */
    public async handle(req: Request): Promise<AskAssistantRequestServiceDto> {
        const assistantThreadId = this.getAssistantThreadIdService.handle(req)
        const question = this.getAssistantQuestionService.handle(req)

        return this.askAssistantRequestServiceDtoMapper.map(
            {
                assistantThreadId,
                question,
            },
            req,
        )
    }
}

export default AskAssistantRequestService
