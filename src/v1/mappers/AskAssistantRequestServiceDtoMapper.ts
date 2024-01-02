import { Request } from 'express'

import AskAssistantRequestServiceDto from '../dtos/AskAssistantRequestServiceDto'
import AssistantThreadIdType from '../types/assistant/AssistantThreadIdType'

class AskAssistantRequestServiceDtoMapper {
    public map(
        {
            assistantThreadId,
            question,
        }: {
            assistantThreadId: AssistantThreadIdType | null
            question: string
        },
        req: Request,
    ): AskAssistantRequestServiceDto {
        return {
            assistantThreadId,
            question,
            req,
        }
    }
}

export default AskAssistantRequestServiceDtoMapper
