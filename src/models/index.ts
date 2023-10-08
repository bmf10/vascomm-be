import fs from 'fs'
import type {
  AssociatedModel,
  Db,
  DefineFunction,
  ModelMap,
} from '../types/model'
import path from 'path'
import Database, { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const basename = path.basename(__filename)

const sequelize = new Sequelize({
  database: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  dialect: 'mysql',
  timezone: '+07:00',
  logging: false,
})

const ext = /\.(ts|js)$/

const models = fs
  .readdirSync(__dirname)
  .reduce((acc: { [k: string]: AssociatedModel }, file) => {
    if (file !== basename && file.indexOf('.') !== 0 && ext.test(file)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const define: { default: DefineFunction } = require(
        path.join(__dirname, file),
      )
      const model: AssociatedModel = define['default'](
        sequelize,
        Database.DataTypes,
      )
      acc[model.name] = model
    }
    return acc
  }, {})

const db: Db = {
  models: models as unknown as ModelMap,
  sequelize,
  Sequelize: Database,
}

Object.keys(models).forEach((modelName) => {
  const associate = models[modelName].associate
  if (associate) {
    associate(db)
  }
})

export default db
