import { RequestHandler, Router } from 'express'
import { BadRequestError } from 'express-response-errors'
import { Joi, schema, validate } from 'express-validation'
import { User } from '../../models/user'
import { successResponse } from '../../utils/general'
import { sign } from '../../utils/jwt'
import { verify } from '../../utils/password'

interface Params {
  readonly email: string
  readonly password: string
}

const validationSchema: schema = {
  body: Joi.object<Params>({
    email: Joi.string().required().email().trim(),
    password: Joi.string().required(),
  }),
}

const requestHandler: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as Params

    const user = await User.findOne({
      where: { email: body.email },
    })

    if (!user) {
      return next(new BadRequestError('Invalid email or password'))
    }

    if (user.status === 'inactive') {
      return next(new BadRequestError('Account Inactive'))
    }

    const isPasswordCorrect = await verify(user.password, body.password)

    if (!isPasswordCorrect) {
      return next(new BadRequestError('Invalid email or password'))
    }

    const payload: object = {
      id: user.id,
    }

    const jwt = await sign(payload)

    return res.json(successResponse({ token: jwt }))
  } catch (error) {
    next(error)
  }
}

const router = Router()

router.post(
  '/login',
  validate(validationSchema, { context: true }),
  requestHandler,
)

export default router
