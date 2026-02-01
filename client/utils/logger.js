// Centralized logging utility
// Only logs in development, can be extended for production logging services

const isDevelopment = process.env.NODE_ENV === 'development'

class Logger {
  log(...args) {
    if (isDevelopment) {
      console.log(...args)
    }
  }

  error(...args) {
    // Always log errors, even in production
    console.error(...args)
    // In production, you could send to error tracking service
    if (!isDevelopment && typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(new Error(args.join(' ')))
    }
  }

  warn(...args) {
    if (isDevelopment) {
      console.warn(...args)
    }
  }

  info(...args) {
    if (isDevelopment) {
      console.info(...args)
    }
  }

  debug(...args) {
    if (isDevelopment) {
      console.debug(...args)
    }
  }
}

export default new Logger()
