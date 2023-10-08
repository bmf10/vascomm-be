import { RequestHandler, Router } from 'express'
import { Joi, schema, validate } from 'express-validation'
import { successResponse } from '../../utils/general'
import { BadRequestError } from 'express-response-errors'
import authMiddleware from '../../middlewares/auth'
import roleAccess from '../../middlewares/roles'
import { PartialUserEntity, User } from '../../models/user'

type Body = Omit<PartialUserEntity, 'id'>

const validationSchema: schema = {
  body: Joi.object<Body>({
    email: Joi.string().email().trim(),
    name: Joi.string().trim(),
    phone: Joi.string()
      .trim()
      .pattern(/^[0-9]+$/)
      .max(15)
      .min(8),
    status: Joi.valid('active', 'inactive'),
    role: Joi.valid('admin', 'user'),
    password: Joi.string(),
  }),
}

const requestHandler: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as Body
    const { id } = req.params

    const user = await User.findByPk(id)

    if (!user) {
      return next(new BadRequestError('User not found'))
    }

    user.set({
      ...body,
    })
    await user?.save()

    return res.json(successResponse(user.toJSON()))
  } catch (error) {
    next(error)
  }
}

const router = Router()

router.patch(
  '/:id',
  authMiddleware,
  roleAccess(['admin']),
  validate(validationSchema, {
    context: true,
  }),
  requestHandler,
)

export default router
