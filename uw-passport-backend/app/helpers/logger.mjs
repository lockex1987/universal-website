import { createLogger, format, transports } from 'winston'
// import DailyRotateFile from 'winston-daily-rotate-file'
import { logLevel } from '#config/log.mjs'
import env from '#base/.env.mjs'

const {
  combine,
  timestamp,
  label,
  json,
  errors,
  printf,
  prettyPrint,
  simple,
  colorize,
} = format

const { File, Console } = transports

const onlyMessage = printf(({ level, message, label, timestamp }) => {
  // return `${timestamp} [${label}] ${level}: ${message}`
  return `${message}`
})

const logger = createLogger({
  exitOnError: false,

  // Đang không được sử dụng vì từng Transport đang có level riêng
  // level: logLevel,

  format: combine(
    timestamp(), // adds a timestamp property
    json(),
    errors({ stack: true }),
    prettyPrint(),
  ),

  transports: [
    // Log lỗi ở riêng một file
    new File({
      filename: 'logs/error.log',
      level: 'error', // warn
    }),

    // File chứa tất cả log
    new File({
      filename: 'logs/app.log',
      level: 'info',
    }),

    // new DailyRotateFile(),
    // Sử dụng rotate của Linux?
  ],

  // Xử lý un-handle exception, rejection
  exceptionHandlers: [
    new File({
      filename: 'logs/exceptions.log',
    }),
  ],

  // logger.exceptions.handle()
  // logger.add({ ..., handleExceptions: true })

  rejectionHandlers: [
    new File({
      filename: 'logs/rejections.log',
    }),
  ],

  // logger.rejections.handle()
})

if (env.ENV == 'dev') {
  logger.add(new Console({
    // format: simple(),
    format: onlyMessage,
    /*
    format: combine(
      colorize(),
      onlyMessage,
    ),
    */
    level: 'debug',
  }))
}

export default logger
