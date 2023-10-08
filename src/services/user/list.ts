import { RequestHandler, Router } from 'express'
import { Joi, schema, validate } from 'express-validation'
import authMiddleware from '../../middlewares/auth'
import roleAccess from '../../middlewares/roles'
import { status, Status, User } from '../../models/user'
import { Op } from 'sequelize'
import { successResponse } from '../../utils/general'

interface Queries {
  readonly page: number
  readonly perPage: number
  readonly search?: string
  readonly status?: Status
}

const validationSchema: schema = {
  query: Joi.object<Queries>({
    page: Joi.number().default(1),
    perPage: Joi.number().default(10),
    search: Joi.string(),
    status: Joi.string().valid(...status),
  }),
}

const requestHandler: RequestHandler = async (req, res, next) => {
  try {
    const { search, perPage, page, status } = req.query as unknown as Queries
    const { count, rows } = await User.findAndCountAll({
      where: {
        ...(search
          ? {
              [Op.or]: {
                name: { [Op.like]: `%${search}%` },
                email: { [Op.like]: `%${search}%` },
              },
            }
          : {}),
        ...(status ? { status } : {}),
      },
      limit: perPage,
      offset: perPage * (page - 1),
    })

    return res.json(
      successResponse({
        page,
        perPage,
        rows: rows.map((v) => v.toJSON()),
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
  roleAccess(['admin']),
  requestHandler,
)

export default router
