const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const { validateEnvironment } = require('./utils/validateEnv')

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

// Store active connections
const activeConnections = new Map()
const activeRooms = new Map()

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
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
      if (!userData || !userData.type || !userData.language) {
        socket.emit('error', { message: 'Invalid user data' })
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
      
      console.log(`User ${socket.id} joined as ${userData.type} speaking ${userData.language}`)
    } catch (error) {
      console.error('Error handling user join:', error)
      socket.emit('error', { message: 'Failed to join room' })
    }
  })

  // Handle messages
  socket.on('message', async (messageData) => {
    try {
      // Validate message data
      if (!messageData || !messageData.message || !messageData.sender || !messageData.language) {
        socket.emit('error', { message: 'Invalid message data' })
        return
      }

      // Sanitize message content
      const sanitizedMessage = messageData.message.trim().substring(0, 1000) // Limit message length
      
      // Store message in database
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
        console.error('Database error:', error)
      }

      // Broadcast message to all connected clients
      socket.broadcast.emit('message', {
        ...messageData,
        message: sanitizedMessage,
        socketId: socket.id
      })

      // Check if message contains price-related keywords
      if (containsPriceKeywords(sanitizedMessage)) {
        // Generate price suggestion
        const priceData = await priceService.generatePriceSuggestion(sanitizedMessage)
        if (priceData) {
          socket.emit('priceUpdate', priceData)
        }

        // Generate negotiation suggestion
        const suggestion = await negotiationService.generateSuggestion(
          sanitizedMessage,
          messageData.sender
        )
        if (suggestion) {
          socket.emit('negotiationSuggestion', suggestion)
        }
      }

    } catch (error) {
      console.error('Message handling error:', error)
      socket.emit('error', { message: 'Failed to process message' })
    }
  })

  // Handle price calculation requests
  socket.on('calculatePrice', async (priceData) => {
    try {
      const calculatedPrice = await priceService.calculatePrice(priceData)
      socket.emit('priceCalculated', calculatedPrice)
    } catch (error) {
      console.error('Price calculation error:', error)
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
        console.error('Deal storage error:', error)
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
      console.error('Deal acceptance error:', error)
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
      console.error('Translation error:', error)
      socket.emit('error', { message: 'Translation failed' })
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
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
  return priceKeywords.some(keyword => lowerMessage.includes(keyword))
}

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
    
    const priceData = await priceService.getCurrentPrice(crop, location)
    res.json(priceData)
  } catch (error) {
    console.error('Price API error:', error)
    res.status(500).json({ error: 'Failed to fetch price data' })
  }
})

app.post('/api/translate', async (req, res) => {
  try {
    const { text, fromLang, toLang } = req.body
    
    const translation = await translationService.translate(text, fromLang, toLang)
    res.json({ 
      originalText: text,
      translatedText: translation,
      fromLang,
      toLang
    })
  } catch (error) {
    console.error('Translation API error:', error)
    res.status(500).json({ error: 'Translation failed' })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`🚀 Multilingual Mandi Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`)
})