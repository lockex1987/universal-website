import { logLevel } from '#config/log.mjs'
import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  level: logLevel,

  format: format.combine(
    format.timestamp(), // adds a timestamp property
    format.json(),
    format.errors({ stack: true }),
    format.prettyPrint(),
  ),

  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'logs/error.log',
      level: 'warn',
    }),
    new transports.File({
      filename: 'logs/app.log',
    }),
  ],

  // TODO: Cho luôn un-handle exception, rejection vào đây
})

// Call exceptions.handle with a transport to handle exceptions
logger.exceptions.handle(
  new transports.File({
    filename: 'logs/exceptions.log',
  }),
)

logger.rejections.handle(
  new transports.File({
    filename: 'logs/rejections.log',
  }),
)

export default logger
