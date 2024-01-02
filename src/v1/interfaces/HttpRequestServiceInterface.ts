import { Request } from 'express'

import HttpRequestServiceDtoInterface from './HttpRequestServiceDtoInterface'

interface HttpRequestServiceInterface {
    handle(req: Request): Promise<HttpRequestServiceDtoInterface>
}

export default HttpRequestServiceInterface
