import type { RequestHandler } from 'express'
import type { RequestContext } from '../types'
import db from '../models'

export default (): RequestHandler => (req, res, next) => {
  const r = req as unknown as {
    ctx: Partial<RequestContext>
  }
  r.ctx = { ...db }
  next()
}
