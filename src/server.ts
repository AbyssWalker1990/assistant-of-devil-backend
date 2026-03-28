import App from './app'
import ParseEnvVariablesService from './v1/services/ParseEnvVariablesService'

const env = new ParseEnvVariablesService().handle(process.env)

new App(env).listen()
