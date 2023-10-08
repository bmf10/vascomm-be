import type { Db } from './model'
import type { Role, Status } from '../models/user'

export interface AuthUser {
  readonly id?: string
  readonly name?: string
  readonly email?: string
  readonly status?: Status
  readonly role?: Role
}

export interface RequestContext extends Db {
  readonly user: AuthUser
}
