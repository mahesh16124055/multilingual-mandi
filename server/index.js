const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const { validateEnvironment } = require('./utils/validateEnv')
const logger = require('./utils/logger')
const { validateMessage, validateUserJoin, validateTranslationRequest, sanitizeString } = require('./utils/validation')

// Validate environment variables
validateEnvironment()

const { createClient } = require('@supabase/supabase-js')
const PriceService = require('./services/priceService')
const TranslationService = require('./services/translationService')
const NegotiationService = require('./services/negotiationService')

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Initialize services
const priceService = new PriceService()
const translationService = new TranslationService()
const negotiationService = new NegotiationService()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// API Routes
app.post('/api/translate', async (req, res) => {
  try {
    const { text, fromLang, toLang } = req.body

    // Validate request
    if (!text || !fromLang || !toLang) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const translation = await translationService.translate(text, fromLang, toLang)
    res.json({ translatedText: translation })

  } catch (error) {
    logger.error('API Translation error:', error)
    res.status(500).json({ error: 'Translation failed' })
  }
})

// Store active connections
const activeConnections = new Map()
const activeRooms = new Map()

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.log('User connected:', socket.id)

  // Store connection info
  activeConnections.set(socket.id, {
    socketId: socket.id,
    connectedAt: new Date(),
    userType: null,
    language: 'en'
  })

  // Handle user joining
  socket.on('join', (userData) => {
    try {
      const validation = validateUserJoin(userData)
      if (!validation.valid) {
        logger.warn('Invalid user join data:', validation.errors)
        socket.emit('error', { message: validation.errors.join(', ') })
        return
      }

      const connection = activeConnections.get(socket.id)
      if (connection) {
        connection.userType = userData.type
        connection.language = userData.language
        connection.userId = userData.userId
      }

      // Join a room based on user type (for matching vendors and buyers)
      const roomName = `${userData.type}_${userData.language}`
      socket.join(roomName)

      logger.log(`User ${socket.id} joined as ${userData.type} speaking ${userData.language}`)
    } catch (error) {
      logger.error('Error handling user join:', error)
      socket.emit('error', { message: 'Failed to join room' })
    }
  })

  // Handle messages
  socket.on('message', async (messageData) => {
    try {
      // Validate message data
      const validation = validateMessage(messageData)
      if (!validation.valid) {
        logger.warn('Invalid message data:', validation.errors)
        socket.emit('error', { message: validation.errors.join(', ') })
        return
      }

      const sanitizedMessage = validation.sanitized.message

      // Store message in database
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert([
            {
              sender_id: socket.id,
              message: sanitizedMessage,
              language: messageData.language,
              sender_type: messageData.sender,
              created_at: new Date()
            }
          ])

        if (error) {
          logger.error('Database error storing message:', error)
          // Don't fail the request, just log the error
        }
      } catch (dbError) {
        logger.error('Database operation failed:', dbError)
        // Continue to broadcast even if DB fails
      }

      // Broadcast message to all connected clients
      socket.broadcast.emit('message', {
        ...messageData,
        message: sanitizedMessage,
        socketId: socket.id
      })

      // Check if message contains price-related keywords
      if (containsPriceKeywords(sanitizedMessage)) {
        try {
          // Generate price suggestion
          const priceData = await priceService.generatePriceSuggestion(sanitizedMessage)
          if (priceData) {
            socket.emit('priceUpdate', priceData)
          }

          // Generate negotiation suggestion
          // First, try to get specific crop context from the message
          const priceInfo = priceService.extractPriceInfo(sanitizedMessage)
          let negotiationContext = { marketPrice: 'variable', crop: 'produce' }

          if (priceInfo.crop) {
            const marketData = await priceService.getCurrentPrice(priceInfo.crop, 'hyderabad') // Default loc
            negotiationContext = {
              crop: priceInfo.crop,
              marketPrice: marketData.finalPrice,
              quality: 'grade-b', // Assume average quality for initial context
              location: 'hyderabad'
            }
          }

          const suggestion = await negotiationService.generateSuggestion(
            sanitizedMessage,
            messageData.sender === 'buyer' ? 'vendor' : 'buyer', // Suggestion for the RECIPIENT
            negotiationContext
          )
          if (suggestion) {
            // Broadcast to the room (or specific recipient if possible, but room is ok for now as long as client filters)
            // Actually, we should emit to the room but the client needs to know WHO the suggestion is for.
            // But current implementation emits to the sender's socket? 
            // socket.emit sends to the SENDER.
            // We want to send to the RECIPIENT.

            // If we use socket.broadcast.emit, it goes to everyone ELSE (which is the recipient in a 2-person chat)
            socket.broadcast.emit('negotiationSuggestion', suggestion)
          }
        } catch (suggestionError) {
          logger.error('Error generating suggestions:', suggestionError)
          // Don't fail the message send if suggestions fail
        }
      }

    } catch (error) {
      logger.error('Message handling error:', error)
      socket.emit('error', { message: 'Failed to process message' })
    }
  })

  // Handle price calculation requests
  socket.on('calculatePrice', async (priceData) => {
    try {
      const calculatedPrice = await priceService.calculatePrice(priceData)
      socket.emit('priceCalculated', calculatedPrice)
    } catch (error) {
      logger.error('Price calculation error:', error)
      socket.emit('error', { message: 'Failed to calculate price' })
    }
  })

  // Handle deal acceptance
  socket.on('acceptDeal', async (dealData) => {
    try {
      // Store deal in database
      const { data, error } = await supabase
        .from('deals')
        .insert([
          {
            participants: dealData.participants,
            price: dealData.price,
            status: 'accepted',
            created_at: new Date()
          }
        ])

      if (error) {
        logger.error('Deal storage error:', error)
        socket.emit('error', { message: 'Failed to store deal' })
        return
      }

      // Notify all participants
      socket.broadcast.emit('dealClosed', {
        ...dealData,
        dealId: data?.[0]?.id
      })

      socket.emit('dealClosed', {
        ...dealData,
        dealId: data?.[0]?.id
      })

    } catch (error) {
      logger.error('Deal acceptance error:', error)
      socket.emit('error', { message: 'Failed to accept deal' })
    }
  })

  // Handle translation requests
  socket.on('translate', async (translationData) => {
    try {
      const translation = await translationService.translate(
        translationData.text,
        translationData.fromLang,
        translationData.toLang
      )

      socket.emit('translated', {
        originalText: translationData.text,
        translatedText: translation,
        fromLang: translationData.fromLang,
        toLang: translationData.toLang
      })
    } catch (error) {
      logger.error('Translation error:', error)
      socket.emit('error', { message: 'Translation failed' })
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.log('User disconnected:', socket.id)
    activeConnections.delete(socket.id)
  })
})

// Helper function to check for price-related keywords
function containsPriceKeywords(message) {
  const priceKeywords = [
    'price', 'rate', 'cost', 'rupees', '₹',
    'मूल्य', 'दर', 'कीमत', 'रुपये',
    'விலை', 'ధర', 'ಬೆಲೆ', 'किंमत', 'দাম'
  ]

  const lowerMessage = message.toLowerCase()
  // Check for keywords OR just digits (potential price)
  return priceKeywords.some(keyword => lowerMessage.includes(keyword)) || /\d+/.test(message)
}

// Basic health check for root URL
app.get('/', (req, res) => {
  res.send('🚀 Multilingual Mandi Server is Running! Access API at /api')
})

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    activeConnections: activeConnections.size
  })
})

app.get('/api/stats', (req, res) => {
  res.json({
    activeConnections: activeConnections.size,
    totalRooms: activeRooms.size,
    uptime: process.uptime()
  })
})

app.get('/api/prices/:crop', async (req, res) => {
  try {
    const { crop } = req.params
    const { location } = req.query

    // Basic validation
    if (!crop || typeof crop !== 'string' || crop.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid crop parameter' })
    }

    const sanitizedCrop = sanitizeString(crop)
    const priceData = await priceService.getCurrentPrice(sanitizedCrop, location)
    res.json(priceData)
  } catch (error) {
    logger.error('Price API error:', error)
    res.status(500).json({ error: 'Failed to fetch price data' })
  }
})

app.post('/api/translate', async (req, res) => {
  try {
    const validation = validateTranslationRequest(req.body)
    if (!validation.valid) {
      logger.warn('Invalid translation request:', validation.errors)
      return res.status(400).json({
        error: 'Invalid request',
        details: validation.errors
      })
    }

    const { text, fromLang, toLang } = validation.sanitized

    // Use server-side translation service which should have access to API keys
    const translation = await translationService.translate(text, fromLang, toLang)

    res.json({
      originalText: text,
      translatedText: translation,
      fromLang,
      toLang
    })
  } catch (error) {
    logger.error('Translation API error:', error)
    res.status(500).json({ error: 'Translation failed' })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Server error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  logger.log(`🚀 Multilingual Mandi Server running on port ${PORT}`)
  logger.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  logger.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`)
})