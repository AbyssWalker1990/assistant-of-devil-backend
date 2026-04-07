import { UserFact } from '../../../models/UserFact'
import { PRE_IDENTIFICATION_INSTRUCTIONS, buildPostIdentificationInstructions } from '../../../constants/systemInstructions'

interface IdentifiedContext {
  userName: string
  facts: UserFact[]
}

class BuildSystemInstructionsService {
  public handle(context?: IdentifiedContext): string {
    if (!context) {
      return PRE_IDENTIFICATION_INSTRUCTIONS
    }
    return buildPostIdentificationInstructions(context.userName, context.facts)
  }
}

export default BuildSystemInstructionsService
