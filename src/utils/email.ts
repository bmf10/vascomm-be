import { createTransport, SendMailOptions, SentMessageInfo } from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const createTransporter = () => {
  return createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    from: process.env.EMAIL_FROM,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

const transporter = createTransporter()

export const sendMail = (
  payload: SendMailOptions,
): Promise<SentMessageInfo> => {
  return transporter.sendMail({ ...payload, from: process.env.EMAIL_FROM })
}
export default transporter
