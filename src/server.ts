import App from './app'
import GetEnvVariablesService from './v1/config/GetEnvVariablesService'

const env = new GetEnvVariablesService().handle(process.env)

new App(env).listen()
