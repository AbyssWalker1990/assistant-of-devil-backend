import { Router } from 'express'
import { Request, Response } from 'express'
import User, { UserMap } from '../models/User'
import CreateSequelizeService from '../config/CreateSequelizeService'

const router = Router()

router.get('/', (req, res) => {
    res.send('Hello World!')
})

// GET - users
router.get('/users', async (req: Request, res: Response) => {
    UserMap(new CreateSequelizeService().handle())
    const result = await User.findAll()
    res.status(200).json({ users: result })
})
// GET - users/:id
router.get('/users/:id', async (req: Request, res: Response) => {
    UserMap(new CreateSequelizeService().handle())
    const id = Number(req.params.id)
    const result = await User.findByPk(id)
    res.status(200).json({ user: result })
})
// POST - users
router.post('/users', async (req: Request, res: Response) => {
    let newUser = req.body as Partial<User>
    UserMap(new CreateSequelizeService().handle())
    const result = await User.create(newUser)
    newUser = result.dataValues as User
    res.status(201).json({ user: newUser })
})

export default router
