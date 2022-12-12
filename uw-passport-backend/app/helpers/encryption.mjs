import crypto from 'node:crypto'
import { encryptionKey } from '#config/app.mjs'

// encryptionKey must be 256 bits (32 bytes, 64 hex characters)
const key = Buffer.from(encryptionKey, 'hex')

const algorithm = 'aes-256-cbc'

export const encrypt = text => {
  // For AES, this is always 16
  const initVector = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), initVector)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return initVector.toString('hex') + ':' + encrypted.toString('hex')
}

export const decrypt = text => {
  const a = text.split(':')
  const initVector = Buffer.from(a[0], 'hex')
  const encrypted = Buffer.from(a[1], 'hex')
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), initVector)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString()
}
