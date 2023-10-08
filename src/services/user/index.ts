import { Router } from 'express'
import list from './list'
import edit from './edit'
import destroy from './destroy'
import create from './create'

const router = Router()

router.use(list)
router.use(edit)
router.use(destroy)
router.use(create)

export default router
