interface ConvertReturn {
  readonly buffer: Buffer
  readonly type?: string
}

export const convertBase64 = (base64: string): ConvertReturn => {
  const buffer = Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ''),
    'base64',
  )
  const extension = base64.split(';')[0].split('/')[1]
  return { buffer, type: extension }
}
