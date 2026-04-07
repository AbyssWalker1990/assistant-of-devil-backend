import { Router } from 'express'

import CreateUserController from '../controllers/CreateUserController'
import GetSingleUserController from '../controllers/GetSingleUserController'
import GetUsersController from '../controllers/GetUsersController'
import HelloController from '../controllers/HelloController'
import SendChatMessageController from '../controllers/SendChatMessageController'
import GetAiUsersController from '../controllers/ai-users/GetAiUsersController'
import GetSingleAiUserController from '../controllers/ai-users/GetSingleAiUserController'
import CreateAiUserController from '../controllers/ai-users/CreateAiUserController'
import UpdateAiUserController from '../controllers/ai-users/UpdateAiUserController'
import DeleteAiUserController from '../controllers/ai-users/DeleteAiUserController'
import GetUserFactsController from '../controllers/user-facts/GetUserFactsController'
import GetSingleUserFactController from '../controllers/user-facts/GetSingleUserFactController'
import CreateUserFactController from '../controllers/user-facts/CreateUserFactController'
import UpdateUserFactController from '../controllers/user-facts/UpdateUserFactController'
import DeleteUserFactController from '../controllers/user-facts/DeleteUserFactController'

const router = Router()

router.get('/', new HelloController().get)
router.get('/users', new GetUsersController().get)
router.get('/users/:id', new GetSingleUserController().get)
router.post('/users', new CreateUserController().post)
router.post('/chat/messages', new SendChatMessageController().post)

router.get('/ai-users', new GetAiUsersController().get)
router.get('/ai-users/:id', new GetSingleAiUserController().get)
router.post('/ai-users', new CreateAiUserController().post)
router.put('/ai-users/:id', new UpdateAiUserController().put)
router.delete('/ai-users/:id', new DeleteAiUserController().delete)

router.get('/ai-users/:userId/facts', new GetUserFactsController().get)
router.get('/ai-users/:userId/facts/:id', new GetSingleUserFactController().get)
router.post('/ai-users/:userId/facts', new CreateUserFactController().post)
router.put('/ai-users/:userId/facts/:id', new UpdateUserFactController().put)
router.delete('/ai-users/:userId/facts/:id', new DeleteUserFactController().delete)

export default router
