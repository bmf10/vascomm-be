import { RequestHandler, Router } from 'express'
import { BadRequestError } from 'express-response-errors'
import { Joi, schema, validate } from 'express-validation'
import { PartialUserEntity, User, UserEntity } from '../../models/user'
import { nanoid } from 'nanoid'
import { generatePassword, successResponse } from '../../utils/general'
import { hash } from '../../utils/password'
import { sendMail } from '../../utils/email'
import type { SendMailOptions } from 'nodemailer'

type Body = Omit<UserEntity, 'id' | 'role' | 'status' | 'password'>

const validationSchema: schema = {
  body: Joi.object<Body>({
    email: Joi.string().required().email().trim(),
    name: Joi.string().required().trim(),
    phone: Joi.string()
      .required()
      .trim()
      .pattern(/^[0-9]+$/)
      .max(15)
      .min(8),
  }),
}

const requestHandler: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as Body

    const user = await User.findOne({
      where: { email: body.email },
      paranoid: false,
    })

    if (user) {
      return next(new BadRequestError('Email Already Used'))
    }

    const password = generatePassword(10)

    const value: PartialUserEntity = {
      ...body,
      id: nanoid(),
      password: await hash(password),
      role: 'user',
    }

    const newUser = await User.create(value)

    const emailPayload: SendMailOptions = {
      to: body.email,
      subject: 'Your Password',
      text: `Hi ${newUser.name}, Your password is ${password}`,
    }

    await sendMail(emailPayload)

    return res.json(successResponse({ id: newUser.id }))
  } catch (error) {
    next(error)
  }
}

const router = Router()

router.post(
  '/create',
  validate(validationSchema, {
    context: true,
  }),
  requestHandler,
)

export default router
