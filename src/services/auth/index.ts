import { Router } from 'express'
import login from './login'
import identify from './identify'

const router = Router()

router.use(login)
router.use(identify)

export default router
