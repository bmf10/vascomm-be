import {} from 'express-serve-static-core'
import { RequestContext } from '../index'

declare module 'express-serve-static-core' {
  interface Request {
    readonly ctx: RequestContext
  }
}
