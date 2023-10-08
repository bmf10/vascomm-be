/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as crypt from 'jsonwebtoken'
import { SignOptions, VerifyOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const secretText = process.env.SECRET_TEXT || ''

const signOptions: SignOptions = {
  algorithm: 'HS256',
  expiresIn: '7d',
  issuer: 'vasacomm-api',
  audience: 'vasacomm-audience',
}

const signResetPassOptions: SignOptions = {
  ...signOptions,
  expiresIn: '1h',
}

const verifyOptions: VerifyOptions = {
  algorithms: ['HS256'],
  issuer: 'vasacomm-api',
  audience: 'vasacomm-audience',
}

export const sign = async (payload: object): Promise<string> =>
  new Promise<string>((resolve, reject) =>
    crypt.sign({ payload }, secretText, signOptions, (e, token) => {
      /* istanbul ignore next */
      if (e) {
        reject(e)
      } else {
        resolve(token as string)
      }
    }),
  )

export interface VerifyResult<T> {
  readonly payload: T
  readonly iat: number
  readonly exp: number
}

export const verify = async <T>(token: string): Promise<VerifyResult<T>> =>
  new Promise((resolve, reject) =>
    crypt.verify(token, secretText, verifyOptions, (e, raw) => {
      if (e) {
        reject(e)
      } else {
        resolve(raw as VerifyResult<T>)
      }
    }),
  )

export const signResetPass = async (payload: string): Promise<string> =>
  new Promise<string>((resolve, reject) =>
    crypt.sign({ payload }, secretText, signResetPassOptions, (e, token) => {
      if (e) {
        reject(e)
      } else {
        resolve(token as string)
      }
    }),
  )

export default { sign, verify, signResetPass }
