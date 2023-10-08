import type { AssociateFunction, DefineFunction } from '../types/model'
import { Model } from 'sequelize'

export const role = ['admin', 'user'] as const

export type Role = (typeof role)[number]

export const status = ['active', 'inactive'] as const

export type Status = (typeof status)[number]

export interface UserEntity {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly password: string
  readonly role: Role
  readonly status: Status
}

export type PartialUserEntity = Partial<UserEntity>

export class User extends Model implements UserEntity {
  static readonly associate: AssociateFunction = () => {
    //relation must be here
  }

  declare id: string
  declare name: string
  declare email: string
  declare phone: string
  declare password: string
  declare role: Role
  declare status: Status

  toJSON(): PartialUserEntity {
    const json = super.toJSON()

    return {
      ...json,
      password: undefined,
    } as PartialUserEntity
  }
}

export type UserModel = typeof User

const define: DefineFunction = (sequelize, DataTypes) => {
  User.init(
    {
      id: {
        allowNull: false,
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING(10),
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING(10),
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
    },
  )

  return User
}

export default define
