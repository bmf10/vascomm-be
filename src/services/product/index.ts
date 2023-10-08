import { Router } from 'express'
import create from './create'
import destroy from './destroy'
import edit from './edit'
import list from './list'

const router = Router()

router.use(create)
router.use(destroy)
router.use(edit)
router.use(list)

export default router
