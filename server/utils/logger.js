// Server-side logging utility

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production'

class Logger {
  log(...args) {
    if (isDevelopment) {
      console.log(...args)
    }
  }

  error(...args) {
    // Always log errors
    console.error('[ERROR]', ...args)
    // In production, send to error tracking service
    // if (process.env.SENTRY_DSN) { ... }
  }

  warn(...args) {
    if (isDevelopment) {
      console.warn('[WARN]', ...args)
    }
  }

  info(...args) {
    if (isDevelopment) {
      console.info('[INFO]', ...args)
    }
  }

  debug(...args) {
    if (isDevelopment) {
      console.debug('[DEBUG]', ...args)
    }
  }
}

module.exports = new Logger()
