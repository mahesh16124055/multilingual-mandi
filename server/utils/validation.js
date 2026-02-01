// Input validation utilities

/**
 * Validates message data
 */
function validateMessage(messageData) {
  const errors = []

  if (!messageData) {
    errors.push('Message data is required')
    return { valid: false, errors }
  }

  if (!messageData.message || typeof messageData.message !== 'string') {
    errors.push('Message text is required and must be a string')
  } else {
    const trimmed = messageData.message.trim()
    if (trimmed.length === 0) {
      errors.push('Message cannot be empty')
    }
    if (trimmed.length > 1000) {
      errors.push('Message exceeds maximum length of 1000 characters')
    }
  }

  if (!messageData.sender || !['vendor', 'buyer'].includes(messageData.sender)) {
    errors.push('Valid sender type (vendor/buyer) is required')
  }

  if (!messageData.language || typeof messageData.language !== 'string') {
    errors.push('Valid language code is required')
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? {
      message: messageData.message.trim().substring(0, 1000),
      sender: messageData.sender,
      language: messageData.language
    } : null
  }
}

/**
 * Validates user join data
 */
function validateUserJoin(userData) {
  const errors = []

  if (!userData) {
    errors.push('User data is required')
    return { valid: false, errors }
  }

  if (!userData.type || !['vendor', 'buyer'].includes(userData.type)) {
    errors.push('Valid user type (vendor/buyer) is required')
  }

  if (!userData.language || typeof userData.language !== 'string') {
    errors.push('Valid language code is required')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validates translation request
 */
function validateTranslationRequest(body) {
  const errors = []

  if (!body) {
    errors.push('Request body is required')
    return { valid: false, errors }
  }

  if (!body.text || typeof body.text !== 'string') {
    errors.push('Text is required and must be a string')
  } else if (body.text.trim().length === 0) {
    errors.push('Text cannot be empty')
  } else if (body.text.length > 5000) {
    errors.push('Text exceeds maximum length of 5000 characters')
  }

  if (!body.fromLang || typeof body.fromLang !== 'string') {
    errors.push('Source language is required')
  }

  if (!body.toLang || typeof body.toLang !== 'string') {
    errors.push('Target language is required')
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? {
      text: body.text.trim().substring(0, 5000),
      fromLang: body.fromLang,
      toLang: body.toLang
    } : null
  }
}

/**
 * Sanitizes string input to prevent XSS
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return ''
  
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000) // Limit length
}

module.exports = {
  validateMessage,
  validateUserJoin,
  validateTranslationRequest,
  sanitizeString
}
