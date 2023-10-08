import { RequestHandler, Router } from 'express'
import { Joi, schema, validate } from 'express-validation'
import { nanoid } from 'nanoid'
import { successResponse } from '../../utils/general'
import authMiddleware from '../../middlewares/auth'
import roleAccess from '../../middlewares/roles'
import { Product, ProductEntity } from '../../models/products'
import { convertBase64 } from '../../utils/file'
import { save } from '../../utils/s3'

type Body = Omit<ProductEntity, 'id'>

const validationSchema: schema = {
  body: Joi.object<Body>({
    image: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    status: Joi.valid('active', 'inactive').default('active'),
  }),
}

const requestHandler: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as Body

    const { buffer, type } = convertBase64(body.image)
    const filename = `${body.name}-${new Date().getTime()}.${type}`
    await save({ key: filename, body: buffer })
    const image = filename

    const classroom = await Product.create({
      id: nanoid(),
      ...body,
      image,
    })

    return res.json(successResponse(await classroom.toJSON()))
  } catch (error) {
    next(error)
  }
}

const router = Router()

router.post(
  '/',
  authMiddleware,
  roleAccess(['admin']),
  validate(validationSchema, {
    context: true,
  }),
  requestHandler,
)

export default router
