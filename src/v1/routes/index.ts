import { Router } from 'express'

import CreateUserController from '../controllers/CreateUserController'
import GetSingleUserController from '../controllers/GetSingleUserController'
import GetUsersController from '../controllers/GetUsersController'
import HelloController from '../controllers/HelloController'
import SendChatMessageController from '../controllers/SendChatMessageController'

const router = Router()

router.get('/', new HelloController().get)
router.get('/users', new GetUsersController().get)
router.get('/users/:id', new GetSingleUserController().get)
router.post('/users', new CreateUserController().post)
router.post('/chat/messages', new SendChatMessageController().post)

export default router
