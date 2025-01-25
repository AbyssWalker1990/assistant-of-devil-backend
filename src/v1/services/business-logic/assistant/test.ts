import SendMessageToAssistantService from './SendMessageToAssistantService'

const send = async () => {
  await new SendMessageToAssistantService().handle()
}

send()
