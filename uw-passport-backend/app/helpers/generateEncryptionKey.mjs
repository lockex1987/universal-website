import crypto from 'node:crypto'

/*
let crypto
try {
  crypto = await import('node:crypto')
} catch (err) {
  console.log('crypto support is disabled!')
}
*/

const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString('hex')
}

console.log(generateEncryptionKey())
