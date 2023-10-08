import { RequestHandler, Router } from 'express'
import { Joi, schema, validate } from 'express-validation'
import { Op } from 'sequelize'
import authMiddleware from '../../middlewares/auth'
import roleAccess from '../../middlewares/roles'
import { Product } from '../../models/products'
import { successResponse } from '../../utils/general'

interface Queries {
  readonly page: number
  readonly perPage: number
  readonly search: string
  readonly status: string
}

const validationSchema: schema = {
  query: Joi.object<Queries>({
    page: Joi.number().default(1),
    perPage: Joi.number().default(10),
    search: Joi.string(),
    status: Joi.string(),
  }),
}
const requestHandler: RequestHandler = async (req, res, next) => {
  try {
    const { perPage, page, search, status } = req.query as unknown as Queries
    const { count, rows } = await Product.findAndCountAll({
      limit: perPage,
      offset: perPage * (page - 1),
      where: {
        ...(search
          ? {
              name: { [Op.like]: `%${search}%` },
            }
          : {}),
        ...(status ? { status } : {}),
      },
    })

    res.json(
      successResponse({
        page,
        perPage,
        rows: await Promise.all(rows.map((v) => v.toJSON())),
        total: count,
      }),
    )
  } catch (error) {
    next(error)
  }
}

const router = Router()

router.get(
  '/',
  validate(validationSchema, {
    context: true,
  }),
  authMiddleware,
  roleAccess(['admin', 'user']),
  requestHandler,
)

export default router
