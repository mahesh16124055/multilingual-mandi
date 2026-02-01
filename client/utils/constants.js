// Application-wide constants

export const MESSAGE_LIMITS = {
  MAX_LENGTH: 1000,
  MAX_CACHE_SIZE: 1000,
  TYPING_TIMEOUT: 3000
}

export const SOCKET_CONFIG = {
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000,
  RECONNECT_DELAY_MAX: 5000,
  PING_INTERVAL: 5000,
  TIMEOUT: 20000
}

export const CONNECTION_QUALITY = {
  EXCELLENT: { threshold: 100, label: 'excellent' },
  GOOD: { threshold: 300, label: 'good' },
  FAIR: { threshold: 500, label: 'fair' },
  POOR: { threshold: Infinity, label: 'poor' }
}

export const USER_TYPES = {
  VENDOR: 'vendor',
  BUYER: 'buyer'
}

export const LANGUAGES = {
  EN: 'en',
  HI: 'hi',
  TA: 'ta',
  TE: 'te',
  KN: 'kn',
  MR: 'mr',
  BN: 'bn'
}

export const DEAL_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  FAILED: 'failed'
}

export const CACHE_CONFIG = {
  TRANSLATION_CACHE_SIZE: 1000,
  MESSAGE_CACHE_SIZE: 500
}

export const API_ENDPOINTS = {
  TRANSLATE: '/api/translate',
  HEALTH: '/api/health',
  STATS: '/api/stats',
  PRICES: '/api/prices'
}

export const DEFAULT_VALUES = {
  LANGUAGE: 'en',
  USER_TYPE: 'buyer',
  PAGE_SIZE: 20,
  DEBOUNCE_DELAY: 300
}
