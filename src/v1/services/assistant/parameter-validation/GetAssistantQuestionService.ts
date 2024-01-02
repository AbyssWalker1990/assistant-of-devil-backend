import { Request } from 'express'
import { get } from 'lodash'
import validator from 'validator'

import AssistantQuestionInvalidError from '../../../errors/parameter-validation/AssistantQuestionInvalidError'

class GetAssistantQuestionService {
    /**
     * @throws parameter-validation/AssistantQuestionInvalidError
     */
    handle(req: Request): string {
        const question = get(req.body, 'question', null)

        const isValid =
            typeof question === 'string' &&
            validator.isAscii(question) &&
            validator.isLength(question, { min: 2, max: 2000 })

        if (!isValid) {
            throw new AssistantQuestionInvalidError()
        }

        return validator.escape(question)
    }
}

export default GetAssistantQuestionService
