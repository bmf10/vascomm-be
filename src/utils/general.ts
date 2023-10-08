export const successResponse = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  message = 'Success',
  code = 200,
) => ({
  status: {
    code: code,
    message: message,
  },
  message: message,
  data,
})

export const generatePassword = (length: number): string => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-='
  let password = ''
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n))
  }
  return password
}
