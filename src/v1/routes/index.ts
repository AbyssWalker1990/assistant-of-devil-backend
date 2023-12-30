import { Router } from 'express'
import { Request, Response } from 'express'
import { eq } from 'drizzle-orm'
import { users } from '../models/User'
import CreateDrizzleService from '../config/CreateDrizzleService'

const router = Router()
const db = new CreateDrizzleService().handle()

router.get('/', (req, res) => {
  res.send('Hello World!')
})

// GET - users
router.get('/users', async (req: Request, res: Response) => {
  const result = await db.select().from(users)
  res.status(200).json({ users: result })
})
// GET - users/:id
router.get('/users/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const result = await db.query.users.findFirst({
    where: eq(users.id, id),
  })
  res.status(200).json({ user: result })
})
// POST - users
router.post('/users', async (req: Request, res: Response) => {
  const [newUser] = await db.insert(users).values(req.body).returning()
  res.status(201).json({ user: newUser })
})

export default router
