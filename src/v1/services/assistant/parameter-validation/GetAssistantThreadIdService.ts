import { Request } from 'express'
import { get, isNull } from 'lodash'
import validator from 'validator'

import AssistantThreadIdInvalidError from '../../../errors/parameter-validation/AssistantThreadIdInvalidError'

class GetAssistantThreadIdService {
    /**
     * @throws parameter-validation/AssistantThreadIdInvalidError
     */
    handle(req: Request): string | null {
        const assistantThreadId = get(req.body, 'assistantThreadId', null)

        if (isNull(assistantThreadId)) {
            return null
        }

        const isValid = typeof assistantThreadId === 'string' && validator.isAscii(assistantThreadId)

        if (!isValid) {
            throw new AssistantThreadIdInvalidError()
        }

        return validator.escape(assistantThreadId)
    }
}

export default GetAssistantThreadIdService
