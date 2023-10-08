import type { RequestHandler } from 'express'
import { UnauthorizedError } from 'express-response-errors'
import { User } from '../models/user'
import { verify } from '../utils/jwt'
import type { AuthUser } from '../types'

const authHeader = (auth?: string) => {
  if (auth && auth.startsWith('Bearer')) {
    return auth.substring(7)
  }
}

const authMiddleware: RequestHandler = async (req, _res, next) => {
  const token = authHeader(req.get('Authorization'))

  if (!token) return next(new UnauthorizedError())
  try {
    const { payload } = await verify<{ readonly id: string }>(token)
    const user = await User.findByPk(payload.id)
    if (!user) {
      next(new UnauthorizedError())
    }

    ;(req.ctx as { user: AuthUser }).user = user!.toJSON()
    next()
  } catch (error) {
    next(new UnauthorizedError())
  }
}

export default authMiddleware
