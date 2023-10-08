import type { AssociateFunction, DefineFunction } from '../types/model'
import { Model } from 'sequelize'
import { getUrl } from '../utils/s3'

export const status = ['active', 'inactive'] as const

export type Status = (typeof status)[number]

export interface ProductEntity {
  readonly id: string
  readonly name: string
  readonly image: string
  readonly price: string
  readonly status: Status
}

export type PartialProductEntity = Partial<ProductEntity>

export class Product extends Model implements ProductEntity {
  static readonly associate: AssociateFunction = () => {
    //relation must be here
  }

  declare id: string
  declare name: string
  declare image: string
  declare price: string
  declare status: Status

  async toJSON(): Promise<PartialProductEntity> {
    const json = super.toJSON()

    return {
      ...json,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      image: await getUrl(json.image),
    } as PartialProductEntity
  }
}

export type ProductModel = typeof Product

const define: DefineFunction = (sequelize, DataTypes) => {
  Product.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        unique: true,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      image: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      price: {
        allowNull: false,
        type: DataTypes.DOUBLE,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      paranoid: true,
    },
  )

  return Product
}

export default define
