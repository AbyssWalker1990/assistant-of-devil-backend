import { Request } from 'express'

import HttpRequestServiceDtoInterface from '../interfaces/HttpRequestServiceDtoInterface'
import AssistantThreadIdType from '../types/assistant/AssistantThreadIdType'

class AskAssistantRequestServiceDto implements HttpRequestServiceDtoInterface {
    public assistantThreadId!: AssistantThreadIdType | null
    public question!: string
    public req!: Request
}

export default AskAssistantRequestServiceDto
