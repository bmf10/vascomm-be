import { RequestHandler, Router } from 'express'
import { Joi, schema, validate } from 'express-validation'
import authMiddleware from '../../middlewares/auth'
import roleAccess from '../../middlewares/roles'
import { successResponse } from '../../utils/general'
import { Product } from '../../models/products'

interface Params {
  readonly id: string
}

const validationSchema: schema = {
  params: Joi.object<Params>({
    id: Joi.string().required(),
  }),
}

const requestHandler: RequestHandler = async (req, res, next) => {
  try {
    const params = req.params as unknown as Params

    await Product.destroy({ where: { id: params.id } })

    res.json(successResponse(null))
  } catch (error) {
    next(error)
  }
}

const router = Router()

router.delete(
  '/:id',
  authMiddleware,
  roleAccess(['admin']),
  validate(validationSchema, {
    context: true,
  }),
  requestHandler,
)

export default router
