import { createLogger, format, transports } from 'winston'
import env from '#base/.env.mjs'

const {
  combine,
  timestamp,
  json,
  errors,
  printf,
  prettyPrint,
} = format

const { File, Console } = transports

const onlyMessage = printf(({ level, message, label, timestamp }) => {
  return `${message}`
})

const logger = createLogger({
  exitOnError: false,

  format: combine(
    timestamp(), // adds a timestamp property
    json(),
    errors({ stack: true }),
    prettyPrint(),
  ),

  transports: [
    new File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new File({
      filename: 'logs/app.log',
    }),
  ],

  exceptionHandlers: [
    new File({
      filename: 'logs/exceptions.log',
    }),
  ],

  rejectionHandlers: [
    new File({
      filename: 'logs/rejections.log',
    }),
  ],
})

if (env.ENV == 'dev') {
  logger.add(new Console({
    format: onlyMessage,
    level: 'debug',
  }))
}

export default logger
