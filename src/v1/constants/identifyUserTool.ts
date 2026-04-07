const identifyUserTool = {
  type: 'function' as const,
  name: 'identify_user',
  description:
    'Identify a user by their name and secret pass phrase. Call this once you have collected both pieces of information from the user. Do not call it with guessed or fabricated data.',
  parameters: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: "The user's name as they provided it",
      },
      passPhrase: {
        type: 'string',
        description: "The user's secret pass phrase — must be at least 5 words",
      },
    },
    required: ['name', 'passPhrase'],
    additionalProperties: false,
  },
  strict: true,
}

export default identifyUserTool
