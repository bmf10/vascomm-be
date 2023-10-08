import Database = require('sequelize')
import type { Sequelize, DataTypes, ModelType, Dialect } from 'sequelize'
import type { UserModel } from '../models/user'

export interface Config {
  readonly username?: string
  readonly password?: string
  readonly database?: string
  readonly host?: string
  readonly dialect?: Dialect
}

export interface AssociateFunction {
  (db: Db): void
}

// Will change later
export interface AssociatedModel extends ModelType {
  readonly associate?: AssociateFunction
}

export interface ModelMap {
  readonly User: UserModel
}

export interface Db {
  readonly Sequelize: typeof Database
  readonly sequelize: Sequelize
  readonly models: Readonly<ModelMap>
}

export interface DefineFunction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (sequelize: Sequelize, dataTypes: typeof DataTypes): any
}
