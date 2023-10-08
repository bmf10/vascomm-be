import { RequestHandler, Router } from 'express'
import { Joi, schema, validate } from 'express-validation'
import { successResponse } from '../../utils/general'
import { Product, PartialProductEntity } from '../../models/products'
import { BadRequestError } from 'express-response-errors'
import authMiddleware from '../../middlewares/auth'
import roleAccess from '../../middlewares/roles'
import { convertBase64 } from '../../utils/file'
import { remove, save } from '../../utils/s3'

type Body = Omit<PartialProductEntity, 'id'>

const validationSchema: schema = {
  body: Joi.object<Body>({
    image: Joi.string(),
    name: Joi.string(),
    price: Joi.number(),
    status: Joi.valid('active', 'inactive'),
  }),
}

const requestHandler: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as Body
    const { id } = req.params

    const product = await Product.findByPk(id)

    if (!product) {
      return next(new BadRequestError('Product not found'))
    }

    const oldImage = product.image
    let image = product.image
    if (body.image) {
      const { buffer, type } = convertBase64(body.image)
      const filename = `${
        body.name || product.name
      }-${new Date().getTime()}.${type}`
      await save({ key: filename, body: buffer })
      image = filename
    }

    product.set({ ...body, image })

    await product.save()

    if (body.image) {
      await remove(oldImage)
    }

    return res.json(successResponse(product.toJSON()))
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
