import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion'
import io from 'socket.io-client'
import Confetti from 'react-confetti'
import {
  Mic,
  MicOff,
  Send,
  CheckCircle,
  User,
  Bot,
  Volume2,
  VolumeX,
  Calculator,
  FileText,
  Star,
  Award,
  Settings,
  Bell,
  Search,
  Filter,
  MoreVertical,
  Minimize2,
  Maximize2,
  X,
  Phone,
  Video,
  Share2,
  Download,
  Upload,
  Clock,
  MapPin,
  Wallet,
  CreditCard,
  Briefcase,
  Package,
  ShoppingCart,
  Heart,
  Truck,
  BarChart3,
  TrendingUp
} from 'lucide-react'
import IndianFlag from '../components/IndianFlag'
import {
  ModernGlobe,
  ModernTrendingUp,
  ModernChat,
  ModernMic,
  ModernUsers,
  ModernShield,
  ModernZap
} from '../components/ModernIcons'
import PerfectFlag from '../components/PerfectFlag'
import { useSupabase } from './_app'
import ChatInterface from '../components/ChatInterface'
import PriceCalculator from '../components/PriceCalculator'
import LanguageSelector from '../components/LanguageSelector'
import VendorDashboard from '../components/VendorDashboard'
import BuyerDashboard from '../components/BuyerDashboard'
import VoiceInterface from '../components/VoiceInterface'
import TranslationService from '../utils/translationService'
import AshokaChakra from '../components/AshokaChakra'
import ImpactSection from '../components/ImpactSection'
import { getDashboardTranslation } from '../utils/dashboardTabTranslations'
import { getTabTranslation } from '../utils/tabContentTranslations'
import { PageLoader } from '../components/LoadingSpinner'
import logger from '../utils/logger'
import { SOCKET_CONFIG, MESSAGE_LIMITS, CONNECTION_QUALITY } from '../utils/constants'

// Custom hooks for advanced state management
const useSocketConnection = (type, selectedLanguage, session, isExplorationMode) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState('excellent')
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  useEffect(() => {
    if (!type) return

    const connectSocket = () => {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
        transports: ['websocket', 'polling'],
        timeout: SOCKET_CONFIG.TIMEOUT,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: SOCKET_CONFIG.RECONNECT_ATTEMPTS,
        reconnectionDelay: SOCKET_CONFIG.RECONNECT_DELAY,
        reconnectionDelayMax: SOCKET_CONFIG.RECONNECT_DELAY_MAX
      })

      // In exploration mode, we still want to connect for the "Live Demo" feel
      // but we treat the user as anonymous


      // Connection quality monitoring
      const pingInterval = setInterval(() => {
        if (newSocket.connected) {
          const start = Date.now()
          newSocket.emit('ping', start, (latency) => {
            if (latency < CONNECTION_QUALITY.EXCELLENT.threshold) {
              setConnectionQuality(CONNECTION_QUALITY.EXCELLENT.label)
            } else if (latency < CONNECTION_QUALITY.GOOD.threshold) {
              setConnectionQuality(CONNECTION_QUALITY.GOOD.label)
            } else if (latency < CONNECTION_QUALITY.FAIR.threshold) {
              setConnectionQuality(CONNECTION_QUALITY.FAIR.label)
            } else {
              setConnectionQuality(CONNECTION_QUALITY.POOR.label)
            }
          })
        }
      }, SOCKET_CONFIG.PING_INTERVAL)

      newSocket.on('connect', () => {
        setIsConnected(true)
        reconnectAttempts.current = 0
        logger.log('Connected to server')

        newSocket.emit('join', {
          type,
          language: selectedLanguage,
          userId: session?.user?.id || `explorer_${type}_${Date.now()}`,
          timestamp: new Date().toISOString()
        })
      })

      newSocket.on('disconnect', (reason) => {
        setIsConnected(false)
        logger.warn('Disconnected from server:', reason)
      })

      newSocket.on('connect_error', (error) => {
        logger.error('Connection error:', error)
        setIsConnected(false)
        reconnectAttempts.current++
      })

      newSocket.on('reconnect', (attemptNumber) => {
        logger.log('Reconnected after', attemptNumber, 'attempts')
        setIsConnected(true)
      })

      setSocket(newSocket)

      return () => {
        clearInterval(pingInterval)
        if (newSocket) {
          newSocket.disconnect()
          newSocket.removeAllListeners()
        }
      }
    }

    return connectSocket()
  }, [type, selectedLanguage, session, isExplorationMode])

  return { socket, isConnected, connectionQuality }
}

const useRealTimeMessages = (socket, selectedLanguage, isExplorationMode) => {
  // Initialize with demo messages for better UX
  const [messages, setMessages] = useState(() => {
    return [
      {
        id: 1,
        message: "नमस्ते! मैं टमाटर बेच रहा हूं। क्या आप खरीदना चाहते हैं?",
        translatedMessage: "Hello! I'm selling tomatoes. Would you like to buy?",
        sender: "vendor",
        timestamp: new Date(Date.now() - 300000),
        language: "hi"
      },
      {
        id: 2,
        message: "Hi! Yes, I'm interested. What's the price per kg?",
        translatedMessage: "हाय! हां, मुझे दिलचस्पी है। प्रति किलो क्या दाम है?",
        sender: "buyer",
        timestamp: new Date(Date.now() - 240000),
        language: "en"
      }
    ]
  })
  const [typingUsers, setTypingUsers] = useState(new Set())
  const translationService = useMemo(() => new TranslationService(), [])

  // Initialize sample messages only once in exploration mode
  const hasInitialized = useRef(false)

  useEffect(() => {
    // In exploration mode, add some sample messages only once
    if (isExplorationMode && !hasInitialized.current) {
      const sampleMessages = [
        {
          id: 'sample_1',
          message: 'Welcome! This is how real-time chat works in our platform.',
          sender: 'system',
          language: 'en',
          translatedMessage: 'Welcome! This is how real-time chat works in our platform.',
          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        },
        {
          id: 'sample_2',
          message: 'I have fresh tomatoes available at ₹40/kg. Interested?',
          sender: 'vendor',
          language: 'en',
          translatedMessage: 'I have fresh tomatoes available at ₹40/kg. Interested?',
          timestamp: new Date(Date.now() - 120000), // 2 minutes ago
        }
      ]
      setMessages(sampleMessages)
      hasInitialized.current = true
    }
  }, [isExplorationMode])

  useEffect(() => {
    if (!socket) return

    const handleMessage = async (data) => {
      try {
        // Add message immediately for better UX, translate in background
        const tempId = data.id || Date.now() + Math.random()
        setMessages(prev => [...prev, {
          ...data,
          translatedMessage: null, // Will be updated after translation
          timestamp: new Date(),
          id: tempId
        }])

        // Translate in background without blocking
        translationService.translate(
          data.message,
          data.language,
          selectedLanguage
        ).then(translatedMessage => {
          setMessages(prev => prev.map(msg =>
            msg.id === tempId
              ? { ...msg, translatedMessage }
              : msg
          ))
        }).catch(error => {
          logger.error('Message processing error:', error)
          setMessages(prev => prev.map(msg =>
            msg.id === tempId
              ? { ...msg, translatedMessage: data.message }
              : msg
          ))
        })
      } catch (error) {
        logger.error('Message processing error:', error)
        setMessages(prev => [...prev, {
          ...data,
          translatedMessage: data.message,
          timestamp: new Date(),
          id: data.id || Date.now() + Math.random()
        }])
      }
    }

    const handleTyping = (data) => {
      setTypingUsers(prev => new Set([...prev, data.userId]))
      setTimeout(() => {
        setTypingUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(data.userId)
          return newSet
        })
      }, MESSAGE_LIMITS.TYPING_TIMEOUT)
    }

    socket.on('message', handleMessage)
    socket.on('typing', handleTyping)

    return () => {
      socket.off('message', handleMessage)
      socket.off('typing', handleTyping)
    }
  }, [socket, selectedLanguage, translationService, isExplorationMode])

  return { messages, setMessages, typingUsers }
}

export default function Dashboard() {
  const router = useRouter()
  const { type, lang, demo } = router.query
  const { supabase, session, loading } = useSupabase()

  // Allow exploration mode - all pages accessible without auth
  // Enable by default for production deployments to allow seamless exploration
  const isExplorationMode = demo === 'true' ||
    process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
    process.env.NODE_ENV === 'production'

  // Advanced state management
  const [selectedLanguage, setSelectedLanguage] = useState(lang || 'en')
  const [currentMessage, setCurrentMessage] = useState('')
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [showPriceCalculator, setShowPriceCalculator] = useState(false)
  const [dealClosed, setDealClosed] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentPrice, setCurrentPrice] = useState(null)
  const [negotiationSuggestion, setNegotiationSuggestion] = useState(null)
  // Initialize sidebar state based on screen size
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true) // Start collapsed on mobile

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarCollapsed(false) // Expanded on desktop
      } else {
        setSidebarCollapsed(true) // Collapsed on mobile
      }
    }

    // Set initial state
    if (typeof window !== 'undefined') {
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [userProfile, setUserProfile] = useState(null)

  // Update language when router query changes
  useEffect(() => {
    if (lang && lang !== selectedLanguage) {
      setSelectedLanguage(lang)
    }
  }, [lang])

  // Authentication check (skip in exploration mode)
  useEffect(() => {
    if (!isExplorationMode && !loading && !session) {
      router.push('/')
    }
  }, [session, loading, router, isExplorationMode])

  // Load user profile (skip in exploration mode)
  useEffect(() => {
    if (!isExplorationMode && session?.user) {
      loadUserProfile()
    } else if (isExplorationMode && type) {
      // Create mock profile for exploration mode
      setUserProfile({
        user_type: type,
        preferred_language: selectedLanguage,
        location: type === 'vendor' ? 'Mumbai, Maharashtra' : 'Delhi, NCR',
        phone: '+91 98765 43210',
        verified: true
      })
    }
  }, [session, isExplorationMode, type, selectedLanguage])

  const loadUserProfile = async () => {
    if (isExplorationMode) {
      // Skip database operations in exploration mode
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error)
        return
      }

      if (!data) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: session.user.id,
            user_type: type || 'vendor',
            preferred_language: selectedLanguage,
            location: '',
            phone: '',
            verified: false
          })

        if (insertError) {
          console.error('Error creating profile:', insertError)
        }
      } else {
        setUserProfile(data)
        // Update language from profile if not set in URL
        if (!lang && data.preferred_language) {
          setSelectedLanguage(data.preferred_language)
        }
      }
    } catch (error) {
      console.error('Profile loading error:', error)
    }
  }

  const handleLogout = async () => {
    if (isExplorationMode) {
      // In exploration mode, just redirect to homepage
      router.push('/')
    } else {
      // Normal logout
      try {
        await supabase.auth.signOut()
        router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }
  const [notifications, setNotifications] = useState([])
  const [userStats, setUserStats] = useState({
    totalDeals: 0,
    successRate: 0,
    avgResponseTime: 0,
    rating: 0
  })

  // Custom hooks
  const { socket, isConnected, connectionQuality } = useSocketConnection(type, selectedLanguage, session, isExplorationMode)
  const { messages, setMessages, typingUsers } = useRealTimeMessages(socket, selectedLanguage, isExplorationMode)

  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Memoized calculations for performance
  const connectionStatusColor = useMemo(() => {
    if (!isConnected) return 'bg-red-500'
    switch (connectionQuality) {
      case 'excellent': return 'bg-green-500'
      case 'good': return 'bg-blue-500'
      case 'fair': return 'bg-yellow-500'
      case 'poor': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }, [isConnected, connectionQuality])

  const userTypeConfig = useMemo(() => ({
    vendor: {
      title: 'विक्रेता डैशबोर्ड',
      titleEn: 'Vendor Dashboard',
      color: 'from-orange-500 to-red-600',
      icon: <Briefcase className="w-6 h-6" />,
      features: ['Price Setting', 'Inventory', 'Analytics', 'Orders']
    },
    buyer: {
      title: 'खरीदार डैशबोर्ड',
      titleEn: 'Buyer Dashboard',
      color: 'from-green-500 to-blue-600',
      icon: <Wallet className="w-6 h-6" />,
      features: ['Browse Products', 'Compare Prices', 'Order History', 'Wishlist']
    }
  }), [])

  // Advanced event handlers with debouncing and optimization
  const handleTyping = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('typing', {
        userId: session?.user?.id || 'anonymous',
        type,
        timestamp: Date.now()
      })
    }
  }, [socket, isConnected, session, type])

  const sendMessage = useCallback(async (messageOverride = null, targetLangOverride = null) => {
    // Use messageOverride if provided, otherwise use currentMessage state
    const messageToSend = messageOverride || currentMessage

    if (!messageToSend || !messageToSend.trim()) {
      return
    }

    const messageText = messageToSend.trim()
    const effectiveTargetLang = targetLangOverride || (selectedLanguage === 'en' ? 'hi' : 'en')

    // Validate message length
    if (messageText.length > MESSAGE_LIMITS.MAX_LENGTH) {
      logger.warn('Message exceeds maximum length')
      return
    }

    try {
      // Auto-detect language of the typed text
      // This ensures if a user has UI in English but types in Hindi, we mark it as Hindi
      const translationService = new TranslationService()
      const detectedLang = translationService.detectLanguage(messageText)

      // If detected language is English (default), fall back to selectedLanguage if it's NOT English
      // This covers cases where detection might be ambiguous but user explicit preference is set
      const finalLang = detectedLang !== 'en' ? detectedLang : selectedLanguage

      // Create message data
      const messageData = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: messageText,
        sender: type,
        language: finalLang,
        targetLanguage: effectiveTargetLang,
        timestamp: new Date(),
        translatedMessage: null
      }

      // Add message immediately
      setMessages(prev => {
        const newMessages = [...prev, messageData]
        logger.debug('Messages updated', { count: newMessages.length })
        return newMessages
      })

      // Only clear currentMessage if we used it (not if messageOverride was provided)
      if (!messageOverride) {
        setCurrentMessage('')
      }

      // Translate message in background
      setTimeout(async () => {
        try {
          const translationService = new TranslationService()
          const translatedMessage = await translationService.translate(
            messageText,
            selectedLanguage,
            effectiveTargetLang
          )

          // Update message with translation
          setMessages(prev => prev.map(msg =>
            msg.id === messageData.id
              ? { ...msg, translatedMessage: translatedMessage !== messageText ? translatedMessage : null }
              : msg
          ))
        } catch (error) {
          logger.error('Translation error:', error)
        }
      }, 100)

      // Send to server (Always send if connected, even in demo mode)
      if (socket && isConnected) {
        socket.emit('message', messageData)
      } else if (isExplorationMode) {
        // Fallback: Only generate fake bot response if socket is NOT connected
        setTimeout(async () => {
          const vendorResponses = [
            'I have fresh vegetables available today!',
            'Quality is excellent, just harvested this morning.',
            'I can offer competitive prices for bulk orders.',
            'Free delivery for orders above ₹500.',
            'Let me check my current stock for you.',
            'What quantity are you looking for?'
          ]

          const buyerResponses = [
            'I\'m interested in your products. What\'s available?',
            'Can you tell me about the quality?',
            'What are your best prices?',
            'Do you offer bulk discounts?',
            'When can you deliver?',
            'Can I see some samples first?'
          ]

          const responseType = type === 'buyer' ? 'vendor' : 'buyer'
          const responses = type === 'buyer' ? vendorResponses : buyerResponses
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]

          const aiMessage = {
            id: `response_${Date.now()}`,
            message: randomResponse,
            sender: responseType,
            language: 'en',
            translatedMessage: null,
            targetLanguage: selectedLanguage,
            timestamp: new Date()
          }

          setMessages(prev => [...prev, aiMessage])

          // Translate AI response
          try {
            const translationService = new TranslationService()
            const aiTranslation = await translationService.translate(
              randomResponse,
              'en',
              selectedLanguage
            )

            setMessages(prev => prev.map(msg =>
              msg.id === aiMessage.id
                ? { ...msg, translatedMessage: aiTranslation !== randomResponse ? aiTranslation : null }
                : msg
            ))
          } catch (error) {
            logger.error('AI translation error:', error)
          }

        }, 1500)
      }

      // Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'message_sent', {
          event_category: 'engagement',
          event_label: type,
          value: 1
        })
      }

      // Server handling AI suggestions now

    } catch (error) {
      logger.error('Error sending message:', error)
      // Rollback optimistic update
      setMessages(prev => prev.filter(msg => msg.id !== messageData.id))
      if (!messageOverride) {
        setCurrentMessage(messageToSend) // Restore message
      }

      // Show error notification
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: 'Failed to send message. Please try again.',
        timestamp: new Date()
      }])
    }
  }, [currentMessage, socket, isConnected, type, selectedLanguage, setMessages, isExplorationMode])

  // Socket event handlers
  const handlePriceUpdate = (priceData) => {
    if (priceData && (priceData.price || priceData.suggestedPrice)) {
      setCurrentPrice(priceData)
    }
  }

  // Removed generateAdvancedNegotiationSuggestion - using server-side logic


  // Advanced scroll management - debounced to prevent lag
  const scrollTimeoutRef = useRef(null)
  useEffect(() => {
    // Debounce scroll to prevent animation lag
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
      }
    }, 100) // Small delay to batch scroll updates

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [messages.length]) // Only depend on length, not full messages array

  // Socket event handlers
  useEffect(() => {
    if (!socket) return

    const handlePriceUpdate = (priceData) => {
      setCurrentPrice(priceData)
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'info',
        message: `Price updated: ₹${priceData.price}/kg`,
        timestamp: new Date()
      }])
    }

    const handleNegotiationSuggestion = (suggestion) => {
      setNegotiationSuggestion(suggestion)
    }

    const handleDealClosed = (dealData) => {
      setDealClosed(true)
      setShowConfetti(true)
      setUserStats(prev => ({
        ...prev,
        totalDeals: prev.totalDeals + 1,
        successRate: Math.min(prev.successRate + 0.1, 1)
      }))
      setTimeout(() => setShowConfetti(false), 5000)
    }

    socket.on('priceUpdate', handlePriceUpdate)
    socket.on('negotiationSuggestion', handleNegotiationSuggestion)
    socket.on('dealClosed', handleDealClosed)

    return () => {
      socket.off('priceUpdate', handlePriceUpdate)
      socket.off('negotiationSuggestion', handleNegotiationSuggestion)
      socket.off('dealClosed', handleDealClosed)
    }
  }, [socket])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault()
            sendMessage()
            break
          case 'k':
            e.preventDefault()
            setActiveTab('search')
            break
          case 'm':
            e.preventDefault()
            setIsVoiceEnabled(!isVoiceEnabled)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [sendMessage, isVoiceEnabled])

  if (!router.isReady || !type || loading) {
    return <PageLoader message="Loading dashboard..." />
  }

  // Skip authentication check in exploration mode
  if (!isExplorationMode && !session) {
    return <PageLoader message="Redirecting to login..." />
  }

  const config = userTypeConfig[type]

  return (
    <>
      <Head>
        <title>{config.titleEn} - Multilingual Mandi</title>
        <meta name="description" content={`Professional ${type} dashboard for multilingual trading`} />
      </Head>

      {/* Confetti Animation */}
      {showConfetti && typeof window !== 'undefined' && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          colors={['#ff9933', '#ffffff', '#138808', '#000080']}
          gravity={0.3}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Clean Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
        </div>

        {/* Mobile Sidebar Overlay - Only show on mobile when sidebar is open */}
        {!sidebarCollapsed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* Main Layout */}
        <div className="relative flex h-screen">
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`${sidebarCollapsed ? 'w-20' : 'w-80'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-lg
              lg:relative lg:translate-x-0
              ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-80'}
              ${sidebarCollapsed ? 'max-lg:w-0 max-lg:overflow-hidden' : 'max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-[60] max-lg:w-80'}
            `}
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-saffron-subtle to-green-subtle">
              <div className="flex items-center justify-between">
                {!sidebarCollapsed && (
                  <div className="flex items-center space-x-4">
                    <PerfectFlag size={48} />
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Multilingual Mandi</h1>
                      <p className="text-sm text-saffron font-medium">विकसित भारत 2047</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {sidebarCollapsed ? <Maximize2 className="w-5 h-5 text-gray-600" /> : <Minimize2 className="w-5 h-5 text-gray-600" />}
                </button>
              </div>
            </div>

            {/* User Profile */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-full flex items-center justify-center text-white`}>
                  {config.icon}
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <h3 className="text-gray-900 font-semibold">
                      {selectedLanguage === 'hi' ? config.title : config.titleEn}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${connectionStatusColor}`}></div>
                      <span className="text-sm text-gray-600">
                        {isConnected ? connectionQuality : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation - Role Specific */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {(type === 'vendor' ? [
                  { id: 'dashboard', icon: BarChart3, labelKey: 'dashboard' },
                  { id: 'products', icon: Package, labelKey: 'products' },
                  { id: 'orders', icon: Briefcase, labelKey: 'orders' },
                  { id: 'chat', icon: ModernChat, labelKey: 'chat' },
                  { id: 'impact', icon: Heart, labelKey: 'impact' },
                  { id: 'analytics', icon: ModernTrendingUp, labelKey: 'analytics' },
                  { id: 'settings', icon: Settings, labelKey: 'settings' }
                ] : [
                  { id: 'dashboard', icon: ShoppingCart, labelKey: 'dashboard' },
                  { id: 'browse', icon: Search, labelKey: 'browse' },
                  { id: 'orders', icon: Truck, labelKey: 'myOrders' },
                  { id: 'chat', icon: ModernChat, labelKey: 'chat' },
                  { id: 'impact', icon: Heart, labelKey: 'impact' },
                  { id: 'wishlist', icon: Heart, labelKey: 'wishlist' },
                  { id: 'settings', icon: Settings, labelKey: 'settings' }
                ]).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                      ? 'bg-gradient-to-r from-saffron-subtle to-green-subtle text-gray-900 border border-saffron/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {!sidebarCollapsed && (
                      <span className="font-medium">
                        {getDashboardTranslation(selectedLanguage, item.labelKey)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </nav>

            {/* Quick Stats */}
            {!sidebarCollapsed && (
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{userStats.totalDeals}</div>
                    <div className="text-xs text-gray-600">
                      {selectedLanguage === 'hi' ? 'सौदे' : 'Deals'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green">{Math.round(userStats.successRate * 100)}%</div>
                    <div className="text-xs text-gray-600">
                      {selectedLanguage === 'hi' ? 'सफलता' : 'Success'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Clean Modern Header */}
            <header className="bg-white border-b border-gray-200 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 lg:space-x-4">
                  {/* Mobile menu toggle */}
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>

                  <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
                    {selectedLanguage === 'hi' ? config.title : config.titleEn}
                  </h1>
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Live</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 lg:space-x-3">{/* Reduced spacing on mobile */}
                  {/* User Profile Info */}
                  <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-saffron to-green rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {isExplorationMode
                          ? (type === 'vendor' ? 'V' : 'B')
                          : session?.user?.email?.charAt(0).toUpperCase()
                        }
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 truncate max-w-24">
                      {isExplorationMode
                        ? (type === 'vendor' ? 'Vendor' : 'Buyer')
                        : (userProfile?.location || 'User')
                      }
                    </span>
                  </div>

                  {/* Notifications */}
                  <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Voice Toggle */}
                  <button
                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                    className={`hidden sm:flex p-2 rounded-lg transition-colors ${isVoiceEnabled
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'hover:bg-gray-100 text-gray-600'
                      }`}
                  >
                    {isVoiceEnabled ? <Mic className="w-4 h-4 lg:w-5 lg:h-5" /> : <MicOff className="w-4 h-4 lg:w-5 lg:h-5" />}
                  </button>

                  {/* Price Calculator Toggle - Hidden on small screens */}
                  <button
                    onClick={() => setShowPriceCalculator(!showPriceCalculator)}
                    className="hidden md:flex btn-primary text-xs lg:text-sm px-2 lg:px-4 py-2 items-center"
                  >
                    <Calculator className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    <span className="hidden lg:inline">{getDashboardTranslation(selectedLanguage, 'priceCalculator')}</span>
                  </button>

                  {/* Language Selector */}
                  <div className="hidden md:block">
                    <LanguageSelector
                      selectedLanguage={selectedLanguage}
                      onLanguageChange={setSelectedLanguage}
                    />
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-gray-600"
                    title="Logout"
                  >
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Main Dashboard Content */}
              <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
                {activeTab === 'dashboard' && (
                  <div className="flex-1 overflow-y-auto">
                    {type === 'vendor' ? (
                      <VendorDashboard
                        selectedLanguage={selectedLanguage}
                        messages={messages}
                        currentPrice={currentPrice}
                        userStats={userStats}
                        onAddProduct={() => logger.debug('Add product')}
                        onEditProduct={(id) => logger.debug('Edit product:', id)}
                        onViewOrders={() => setActiveTab('orders')}
                      />
                    ) : (
                      <BuyerDashboard
                        selectedLanguage={selectedLanguage}
                        messages={messages}
                        currentPrice={currentPrice}
                        userStats={userStats}
                        onSearchProducts={() => logger.debug('Search products')}
                        onViewCart={() => logger.debug('View cart')}
                        onViewOrders={() => setActiveTab('orders')}
                      />
                    )}
                  </div>
                )}

                {activeTab === 'chat' && (
                  <div className="flex-1 flex flex-col">
                    <ChatInterface
                      messages={messages}
                      onSendMessage={sendMessage}
                      currentMessage={currentMessage}
                      setCurrentMessage={setCurrentMessage}
                      setCurrentMessage={setCurrentMessage}
                      language={selectedLanguage}
                      targetLanguage={selectedLanguage === 'en' ? 'hi' : 'en'}
                      userType={type}
                      isConnected={isConnected}
                      typingUsers={typingUsers}
                      onTyping={handleTyping}
                      negotiationSuggestion={negotiationSuggestion}
                      setNegotiationSuggestion={setNegotiationSuggestion}
                    />
                  </div>
                )}

                {activeTab === 'impact' && (
                  <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <ImpactSection selectedLanguage={selectedLanguage} />
                  </div>
                )}

                {activeTab !== 'dashboard' && activeTab !== 'chat' && activeTab !== 'impact' && (
                  <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {/* My Products Tab */}
                    {activeTab === 'products' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900">
                            {getDashboardTranslation(selectedLanguage, 'products')}
                          </h2>
                          <button className="btn-primary">
                            + {getTabTranslation('labels', 'Add Product', selectedLanguage) || (selectedLanguage === 'hi' ? 'नया उत्पाद जोड़ें' : 'Add New Product')}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[
                            { name: 'Fresh Tomatoes', nameHi: 'ताजे टमाटर', price: '₹40/kg', stock: '150 kg', image: '🍅', status: 'In Stock' },
                            { name: 'Red Onions', nameHi: 'लाल प्याज', price: '₹25/kg', stock: '200 kg', image: '🧅', status: 'In Stock' },
                            { name: 'Green Chilies', nameHi: 'हरी मिर्च', price: '₹80/kg', stock: '50 kg', image: '🌶️', status: 'Low Stock' },
                            { name: 'Potatoes', nameHi: 'आलू', price: '₹20/kg', stock: '300 kg', image: '🥔', status: 'In Stock' },
                            { name: 'Carrots', nameHi: 'गाजर', price: '₹35/kg', stock: '80 kg', image: '🥕', status: 'In Stock' },
                            { name: 'Cauliflower', nameHi: 'फूलगोभी', price: '₹30/piece', stock: '25 pieces', image: '🥬', status: 'Low Stock' }
                          ].map((product, index) => (
                            <div key={index} className="card-premium">
                              <div className="text-4xl mb-3">{product.image}</div>
                              <h3 className="font-semibold text-gray-900 mb-2">
                                {getTabTranslation('products', product.name, selectedLanguage)}
                              </h3>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{getTabTranslation('labels', 'Price:', selectedLanguage)}</span>
                                  <span className="font-semibold text-saffron">{product.price}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{getTabTranslation('labels', 'Stock:', selectedLanguage)}</span>
                                  <span className="font-medium">{product.stock}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{getTabTranslation('labels', 'Status:', selectedLanguage)}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {getTabTranslation('labels', product.status, selectedLanguage)}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-4 flex space-x-2">
                                <button className="btn-secondary text-sm flex-1">
                                  {getTabTranslation('labels', 'Edit', selectedLanguage)}
                                </button>
                                <button className="btn-outline text-sm flex-1">
                                  {getTabTranslation('labels', 'Delete', selectedLanguage)}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900">
                            {getDashboardTranslation(selectedLanguage, 'orders')}
                          </h2>
                          <div className="flex space-x-2">
                            <select className="px-3 py-2 border border-gray-300 rounded-lg">
                              <option>{selectedLanguage === 'hi' ? 'सभी ऑर्डर' : 'All Orders'}</option>
                              <option>{selectedLanguage === 'hi' ? 'लंबित' : 'Pending'}</option>
                              <option>{selectedLanguage === 'hi' ? 'पूर्ण' : 'Completed'}</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {[
                            { id: '#ORD-001', customer: 'Rajesh Kumar', items: 'Tomatoes (10kg), Onions (5kg)', total: '₹525', status: 'Pending', date: '2024-01-26' },
                            { id: '#ORD-002', customer: 'Priya Sharma', items: 'Potatoes (15kg), Carrots (3kg)', total: '₹405', status: 'Completed', date: '2024-01-25' },
                            { id: '#ORD-003', customer: 'Amit Singh', items: 'Green Chilies (2kg), Cauliflower (4 pieces)', total: '₹280', status: 'Processing', date: '2024-01-26' },
                            { id: '#ORD-004', customer: 'Sunita Devi', items: 'Tomatoes (8kg), Potatoes (12kg)', total: '₹560', status: 'Completed', date: '2024-01-24' },
                            { id: '#ORD-005', customer: 'Vikram Patel', items: 'Onions (20kg), Carrots (5kg)', total: '₹675', status: 'Pending', date: '2024-01-26' }
                          ].map((order, index) => (
                            <div key={index} className="card-premium">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{order.id}</h3>
                                  <p className="text-gray-600">{order.customer}</p>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-lg text-saffron">{order.total}</div>
                                  <div className="text-sm text-gray-500">{order.date}</div>
                                </div>
                              </div>
                              <div className="mb-4">
                                <p className="text-gray-700">{order.items}</p>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                  {order.status === 'Completed' ? (selectedLanguage === 'hi' ? 'पूर्ण' : 'Completed') :
                                    order.status === 'Pending' ? (selectedLanguage === 'hi' ? 'लंबित' : 'Pending') :
                                      (selectedLanguage === 'hi' ? 'प्रसंस्करण' : 'Processing')
                                  }
                                </span>
                                <div className="flex space-x-2">
                                  <button className="btn-secondary text-sm">
                                    {selectedLanguage === 'hi' ? 'विवरण' : 'Details'}
                                  </button>
                                  {order.status === 'Pending' && (
                                    <button className="btn-primary text-sm">
                                      {selectedLanguage === 'hi' ? 'स्वीकार करें' : 'Accept'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {getDashboardTranslation(selectedLanguage, 'analytics')}
                        </h2>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {[
                            { title: selectedLanguage === 'hi' ? 'कुल बिक्री' : 'Total Sales', value: '₹45,280', change: '+12%', icon: '💰', color: 'green' },
                            { title: selectedLanguage === 'hi' ? 'ऑर्डर' : 'Orders', value: '156', change: '+8%', icon: '📦', color: 'blue' },
                            { title: selectedLanguage === 'hi' ? 'ग्राहक' : 'Customers', value: '89', change: '+15%', icon: '👥', color: 'purple' },
                            { title: selectedLanguage === 'hi' ? 'औसत ऑर्डर' : 'Avg Order', value: '₹290', change: '+5%', icon: '📊', color: 'orange' }
                          ].map((metric, index) => (
                            <div key={index} className="card-premium text-center">
                              <div className="text-3xl mb-2">{metric.icon}</div>
                              <h3 className="text-sm text-gray-600 mb-1">{metric.title}</h3>
                              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                              <div className={`text-sm font-medium ${metric.color === 'green' ? 'text-green-600' :
                                metric.color === 'blue' ? 'text-blue-600' :
                                  metric.color === 'purple' ? 'text-purple-600' :
                                    'text-orange-600'
                                }`}>
                                {metric.change} {selectedLanguage === 'hi' ? 'इस महीने' : 'this month'}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="card-premium">
                            <h3 className="text-lg font-semibold mb-4">
                              {selectedLanguage === 'hi' ? 'साप्ताहिक बिक्री' : 'Weekly Sales'}
                            </h3>
                            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-4xl mb-2">📈</div>
                                <p className="text-gray-600">
                                  {selectedLanguage === 'hi' ? 'चार्ट डेटा' : 'Chart Data'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="card-premium">
                            <h3 className="text-lg font-semibold mb-4">
                              {selectedLanguage === 'hi' ? 'शीर्ष उत्पाद' : 'Top Products'}
                            </h3>
                            <div className="space-y-3">
                              {[
                                { name: selectedLanguage === 'hi' ? 'टमाटर' : 'Tomatoes', sales: '₹12,450', percentage: 85 },
                                { name: selectedLanguage === 'hi' ? 'प्याज' : 'Onions', sales: '₹8,920', percentage: 65 },
                                { name: selectedLanguage === 'hi' ? 'आलू' : 'Potatoes', sales: '₹6,780', percentage: 45 },
                                { name: selectedLanguage === 'hi' ? 'गाजर' : 'Carrots', sales: '₹4,230', percentage: 30 }
                              ].map((product, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-sm text-gray-600">{product.sales}</div>
                                  </div>
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-saffron h-2 rounded-full"
                                      style={{ width: `${product.percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {getDashboardTranslation(selectedLanguage, 'settings')}
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Profile Settings */}
                          <div className="card-premium">
                            <h3 className="text-lg font-semibold mb-4">
                              {selectedLanguage === 'hi' ? 'प्रोफ़ाइल सेटिंग्स' : 'Profile Settings'}
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {selectedLanguage === 'hi' ? 'नाम' : 'Name'}
                                </label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="Rajesh Kumar" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {selectedLanguage === 'hi' ? 'ईमेल' : 'Email'}
                                </label>
                                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="rajesh@example.com" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {selectedLanguage === 'hi' ? 'फोन' : 'Phone'}
                                </label>
                                <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="+91 98765 43210" />
                              </div>
                              <button className="btn-primary w-full">
                                {selectedLanguage === 'hi' ? 'प्रोफ़ाइल अपडेट करें' : 'Update Profile'}
                              </button>
                            </div>
                          </div>

                          {/* Business Settings */}
                          <div className="card-premium">
                            <h3 className="text-lg font-semibold mb-4">
                              {selectedLanguage === 'hi' ? 'व्यापार सेटिंग्स' : 'Business Settings'}
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {selectedLanguage === 'hi' ? 'दुकान का नाम' : 'Shop Name'}
                                </label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="Kumar Fresh Vegetables" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {selectedLanguage === 'hi' ? 'पता' : 'Address'}
                                </label>
                                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" defaultValue="Shop No. 15, Vegetable Market, Sector 14, Gurgaon, Haryana 122001"></textarea>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {selectedLanguage === 'hi' ? 'GST नंबर' : 'GST Number'}
                                </label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="06AABCU9603R1ZM" />
                              </div>
                            </div>
                          </div>

                          {/* Notification Settings */}
                          <div className="card-premium">
                            <h3 className="text-lg font-semibold mb-4">
                              {selectedLanguage === 'hi' ? 'सूचना सेटिंग्स' : 'Notification Settings'}
                            </h3>
                            <div className="space-y-4">
                              {[
                                { key: 'orders', label: selectedLanguage === 'hi' ? 'नए ऑर्डर' : 'New Orders', enabled: true },
                                { key: 'messages', label: selectedLanguage === 'hi' ? 'संदेश' : 'Messages', enabled: true },
                                { key: 'lowstock', label: selectedLanguage === 'hi' ? 'कम स्टॉक अलर्ट' : 'Low Stock Alerts', enabled: false },
                                { key: 'promotions', label: selectedLanguage === 'hi' ? 'प्रमोशन' : 'Promotions', enabled: true }
                              ].map((setting, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-gray-700">{setting.label}</span>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saffron/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saffron"></div>
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Language & Region */}
                          <div className="card-premium">
                            <h3 className="text-lg font-semibold mb-4">
                              {selectedLanguage === 'hi' ? 'भाषा और क्षेत्र' : 'Language & Region'}
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {selectedLanguage === 'hi' ? 'भाषा' : 'Language'}
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                  <option value="en">English</option>
                                  <option value="hi">हिंदी (Hindi)</option>
                                  <option value="ta">தமிழ் (Tamil)</option>
                                  <option value="te">తెలుగు (Telugu)</option>
                                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                                  <option value="mr">मराठी (Marathi)</option>
                                  <option value="bn">বাংলা (Bengali)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {selectedLanguage === 'hi' ? 'मुद्रा' : 'Currency'}
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                  <option value="INR">₹ Indian Rupee (INR)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {selectedLanguage === 'hi' ? 'समय क्षेत्र' : 'Time Zone'}
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                  <option value="IST">India Standard Time (IST)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Browse Products Tab (for buyers) */}
                    {activeTab === 'browse' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900">
                            {getDashboardTranslation(selectedLanguage, 'browse')}
                          </h2>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder={selectedLanguage === 'hi' ? 'उत्पाद खोजें...' : 'Search products...'}
                              className="px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <select className="px-3 py-2 border border-gray-300 rounded-lg">
                              <option>{selectedLanguage === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}</option>
                              <option>{selectedLanguage === 'hi' ? 'सब्जियां' : 'Vegetables'}</option>
                              <option>{selectedLanguage === 'hi' ? 'फल' : 'Fruits'}</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[
                            { name: 'Fresh Tomatoes', nameHi: 'ताजे टमाटर', price: '₹40/kg', vendor: 'Kumar Vegetables', rating: 4.5, image: '🍅' },
                            { name: 'Red Onions', nameHi: 'लाल प्याज', price: '₹25/kg', vendor: 'Sharma Fresh', rating: 4.2, image: '🧅' },
                            { name: 'Green Chilies', nameHi: 'हरी मिर्च', price: '₹80/kg', vendor: 'Patel Farm', rating: 4.8, image: '🌶️' },
                            { name: 'Potatoes', nameHi: 'आलू', price: '₹20/kg', vendor: 'Singh Vegetables', rating: 4.0, image: '🥔' },
                            { name: 'Fresh Carrots', nameHi: 'ताजी गाजर', price: '₹35/kg', vendor: 'Fresh Market', rating: 4.6, image: '🥕' },
                            { name: 'Cauliflower', nameHi: 'फूलगोभी', price: '₹30/piece', vendor: 'Green Valley', rating: 4.3, image: '🥬' }
                          ].map((product, index) => (
                            <div key={index} className="card-premium">
                              <div className="text-4xl mb-3">{product.image}</div>
                              <h3 className="font-semibold text-gray-900 mb-2">
                                {selectedLanguage === 'hi' ? product.nameHi : product.name}
                              </h3>
                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{selectedLanguage === 'hi' ? 'मूल्य:' : 'Price:'}</span>
                                  <span className="font-semibold text-saffron">{product.price}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{selectedLanguage === 'hi' ? 'विक्रेता:' : 'Vendor:'}</span>
                                  <span className="text-sm">{product.vendor}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">{selectedLanguage === 'hi' ? 'रेटिंग:' : 'Rating:'}</span>
                                  <div className="flex items-center">
                                    <span className="text-yellow-500">★</span>
                                    <span className="text-sm ml-1">{product.rating}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button className="btn-primary text-sm flex-1">
                                  {selectedLanguage === 'hi' ? 'ऑर्डर करें' : 'Order Now'}
                                </button>
                                <button className="btn-outline text-sm">
                                  {selectedLanguage === 'hi' ? 'चैट' : 'Chat'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Wishlist Tab (for buyers) */}
                    {activeTab === 'wishlist' && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {getDashboardTranslation(selectedLanguage, 'wishlist')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[
                            { name: 'Organic Tomatoes', nameHi: 'जैविक टमाटर', price: '₹60/kg', vendor: 'Organic Farm', image: '🍅' },
                            { name: 'Premium Onions', nameHi: 'प्रीमियम प्याज', price: '₹35/kg', vendor: 'Premium Vegetables', image: '🧅' },
                            { name: 'Baby Carrots', nameHi: 'बेबी गाजर', price: '₹80/kg', vendor: 'Fresh Garden', image: '🥕' }
                          ].map((product, index) => (
                            <div key={index} className="card-premium">
                              <div className="text-4xl mb-3">{product.image}</div>
                              <h3 className="font-semibold text-gray-900 mb-2">
                                {selectedLanguage === 'hi' ? product.nameHi : product.name}
                              </h3>
                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{selectedLanguage === 'hi' ? 'मूल्य:' : 'Price:'}</span>
                                  <span className="font-semibold text-saffron">{product.price}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{selectedLanguage === 'hi' ? 'विक्रेता:' : 'Vendor:'}</span>
                                  <span className="text-sm">{product.vendor}</span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button className="btn-primary text-sm flex-1">
                                  {selectedLanguage === 'hi' ? 'ऑर्डर करें' : 'Order Now'}
                                </button>
                                <button className="btn-outline text-sm">
                                  ❤️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fallback for any other tabs */}
                    {!['products', 'orders', 'analytics', 'settings', 'browse', 'wishlist'].includes(activeTab) && (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🚧</div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {selectedLanguage === 'hi' ? 'जल्द आ रहा है' : 'Coming Soon'}
                          </h3>
                          <p className="text-gray-600">
                            {selectedLanguage === 'hi'
                              ? 'यह सुविधा जल्द ही उपलब्ध होगी'
                              : 'This feature will be available soon'
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Sidebar - Hidden on mobile */}
              <AnimatePresence>
                {(showPriceCalculator || isVoiceEnabled) && (
                  <motion.aside
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-16 right-0 bottom-0 w-96 bg-white border-l border-gray-200 shadow-2xl z-50 overflow-hidden flex flex-col"
                  >
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-saffron-subtle to-green-subtle">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Tools</h3>
                        <button
                          onClick={() => {
                            setShowPriceCalculator(false)
                            setIsVoiceEnabled(false)
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {/* Price Calculator */}
                      {showPriceCalculator && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="card-premium"
                        >
                          <PriceCalculator
                            userType={type}
                            language={selectedLanguage}
                            onPriceUpdate={setCurrentPrice}
                          />
                        </motion.div>
                      )}

                      {/* Voice Interface */}
                      {isVoiceEnabled && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="card-premium"
                        >
                          <VoiceInterface
                            language={selectedLanguage}
                            onVoiceMessage={(message) => {
                              setCurrentMessage(message)
                            }}
                          />
                        </motion.div>
                      )}

                      {/* Current Deal */}
                      {currentPrice && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="card-premium"
                        >
                          <div className="flex items-center space-x-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-green" />
                            <h4 className="font-semibold text-gray-900">Current Deal</h4>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Item:</span>
                              <span className="font-medium text-gray-900">{currentPrice.item}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Quantity:</span>
                              <span className="font-medium text-gray-900">{currentPrice.quantity} kg</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-bold text-saffron">₹{currentPrice.price}/kg</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Total:</span>
                              <span className="font-bold text-green">
                                ₹{(currentPrice.price * currentPrice.quantity).toLocaleString()}
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                if (socket) {
                                  socket.emit('acceptDeal', {
                                    price: currentPrice,
                                    timestamp: new Date(),
                                    participants: [type]
                                  })
                                }
                              }}
                              className="w-full mt-4 btn-secondary flex items-center justify-center space-x-2"
                            >
                              <CheckCircle className="w-5 h-5" />
                              <span>Accept Deal</span>
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Deal Success */}
                      {dealClosed && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="card-premium bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green/30 text-center"
                        >
                          <Award className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Deal Closed! 🎉</h3>
                          <p className="text-gray-600 mb-4">Congratulations on your successful trade!</p>
                          <button
                            onClick={() => {
                              // Generate invoice logic
                              logger.debug('Generating invoice...')
                            }}
                            className="btn-outline mx-auto flex items-center space-x-2"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Generate Invoice</span>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </motion.aside>
                )}
              </AnimatePresence >
            </div >
          </main >
        </div >

        {/* Notifications Toast */}
        < AnimatePresence >
          {
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 400 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 400 }}
                className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-xl p-4 max-w-sm shadow-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${notification.type === 'error' ? 'bg-red-500' :
                    notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                  <p className="text-gray-900 text-sm">{notification.message}</p>
                  <button
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          }
        </AnimatePresence >
      </div >
    </>
  )
}