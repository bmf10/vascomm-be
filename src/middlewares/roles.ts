import type { NextFunction, Request, Response } from 'express'
import { ForbiddenError } from 'express-response-errors'
import type { Role } from '../models/user'

const roleAccess =
  (roles: ReadonlyArray<Role>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.ctx.user) {
      next(new ForbiddenError('Access Denied'))
    }

    const userRole = req.ctx.user.role!

    if (roles.includes(userRole)) {
      next()
    } else {
      next(new ForbiddenError('Access Denied'))
    }
  }

export default roleAccess
