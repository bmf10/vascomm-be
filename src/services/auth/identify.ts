import { RequestHandler, Router } from 'express'
import authMiddleware from '../../middlewares/auth'
import { successResponse } from '../../utils/general'

const requestHandler: RequestHandler = (req, res) => {
  res.json(successResponse(req.ctx.user))
}

const router = Router()

router.get('/identify', authMiddleware, requestHandler)

export default router
