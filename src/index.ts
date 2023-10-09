import express, { Express, json, urlencoded } from 'express'
import dotenv from 'dotenv'
import services from './services'
import db from './models'
import errors from './errors'
import ctx from './middlewares/context'
import cors from 'cors'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8000

app.use(async (_req, _res, next) => {
  await db.sequelize.authenticate()
  next()
})

app.use(json())
app.use(urlencoded({ extended: false }))

app.use(cors())

app.use(ctx())

app.get('/', (_req, res) => {
  res.send('Hello World')
})

app.use(services)

app.use(errors)

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
