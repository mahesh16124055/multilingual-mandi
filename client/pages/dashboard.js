import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion'
import io from 'socket.io-client'
import Confetti from 'react-confetti'
import { 
  MessageCircle, 
  Mic, 
  MicOff, 
  Send, 
  TrendingUp, 
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
  Zap,
  Shield,
  Globe,
  Activity,
  BarChart3,
  PieChart,
  Users,
  Clock,
  MapPin,
  Wallet,
  CreditCard,
  Briefcase,
  Package,
  ShoppingCart,
  Heart,
  Truck
} from 'lucide-react'
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
import { PageLoader } from '../components/LoadingSpinner'

// Custom hooks for advanced state management
const useSocketConnection = (type, selectedLanguage, session) => {
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
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
      })

      // Connection quality monitoring
      const pingInterval = setInterval(() => {
        if (newSocket.connected) {
          const start = Date.now()
          newSocket.emit('ping', start, (latency) => {
            if (latency < 100) setConnectionQuality('excellent')
            else if (latency < 300) setConnectionQuality('good')
            else if (latency < 500) setConnectionQuality('fair')
            else setConnectionQuality('poor')
          })
        }
      }, 5000)

      newSocket.on('connect', () => {
        setIsConnected(true)
        reconnectAttempts.current = 0
        console.log('🟢 Connected to server')
        
        newSocket.emit('join', {
          type,
          language: selectedLanguage,
          userId: session?.user?.id || `anonymous_${Date.now()}`,
          timestamp: new Date().toISOString()
        })
      })

      newSocket.on('disconnect', (reason) => {
        setIsConnected(false)
        console.log('🔴 Disconnected:', reason)
      })

      newSocket.on('connect_error', (error) => {
        console.error('🔴 Connection error:', error)
        setIsConnected(false)
        reconnectAttempts.current++
      })

      newSocket.on('reconnect', (attemptNumber) => {
        console.log('🟡 Reconnected after', attemptNumber, 'attempts')
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
  }, [type, selectedLanguage, session])

  return { socket, isConnected, connectionQuality }
}

const useRealTimeMessages = (socket, selectedLanguage) => {
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState(new Set())
  const translationService = useMemo(() => new TranslationService(), [])

  useEffect(() => {
    if (!socket) return

    const handleMessage = async (data) => {
      try {
        const translatedMessage = await translationService.translate(
          data.message, 
          data.language, 
          selectedLanguage
        )
        
        setMessages(prev => [...prev, {
          ...data,
          translatedMessage,
          timestamp: new Date(),
          id: data.id || Date.now() + Math.random()
        }])
      } catch (error) {
        console.error('Message processing error:', error)
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
      }, 3000)
    }

    socket.on('message', handleMessage)
    socket.on('typing', handleTyping)

    return () => {
      socket.off('message', handleMessage)
      socket.off('typing', handleTyping)
    }
  }, [socket, selectedLanguage, translationService])

  return { messages, setMessages, typingUsers }
}

export default function Dashboard() {
  const router = useRouter()
  const { type, lang } = router.query
  const { supabase, session } = useSupabase()
  
  // Advanced state management
  const [selectedLanguage, setSelectedLanguage] = useState(lang || 'en')
  const [currentMessage, setCurrentMessage] = useState('')
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [showPriceCalculator, setShowPriceCalculator] = useState(false)
  const [dealClosed, setDealClosed] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentPrice, setCurrentPrice] = useState(null)
  const [negotiationSuggestion, setNegotiationSuggestion] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const [notifications, setNotifications] = useState([])
  const [userStats, setUserStats] = useState({
    totalDeals: 0,
    successRate: 0,
    avgResponseTime: 0,
    rating: 0
  })

  // Custom hooks
  const { socket, isConnected, connectionQuality } = useSocketConnection(type, selectedLanguage, session)
  const { messages, setMessages, typingUsers } = useRealTimeMessages(socket, selectedLanguage)
  
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

  const sendMessage = useCallback(async () => {
    if (!currentMessage.trim() || !socket || !isConnected) return

    const messageData = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: currentMessage.trim(),
      sender: type,
      language: selectedLanguage,
      timestamp: new Date(),
      metadata: {
        platform: 'web',
        version: '1.0.0',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : ''
      }
    }

    try {
      // Optimistic update
      setMessages(prev => [...prev, messageData])
      setCurrentMessage('')
      
      // Send to server
      socket.emit('message', messageData)
      
      // Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'message_sent', {
          event_category: 'engagement',
          event_label: type,
          value: 1
        })
      }

      // AI suggestion trigger
      if (currentMessage.toLowerCase().includes('price') || 
          currentMessage.toLowerCase().includes('₹') ||
          currentMessage.toLowerCase().includes('rate')) {
        
        setTimeout(() => {
          const suggestion = generateAdvancedNegotiationSuggestion(currentMessage, type)
          if (suggestion) {
            setNegotiationSuggestion(suggestion)
          }
        }, 1000)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Rollback optimistic update
      setMessages(prev => prev.filter(msg => msg.id !== messageData.id))
      setCurrentMessage(currentMessage) // Restore message
      
      // Show error notification
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: 'Failed to send message. Please try again.',
        timestamp: new Date()
      }])
    }
  }, [currentMessage, socket, isConnected, type, selectedLanguage, setMessages])

  const generateAdvancedNegotiationSuggestion = useCallback((message, userType) => {
    const priceMatch = message.match(/₹(\d+)/g)
    if (priceMatch) {
      const price = parseInt(priceMatch[0].replace('₹', ''))
      const marketAnalysis = {
        currentMarketRate: price * (0.95 + Math.random() * 0.1),
        trend: ['rising', 'stable', 'falling'][Math.floor(Math.random() * 3)],
        confidence: 0.85 + Math.random() * 0.1
      }
      
      if (userType === 'buyer') {
        return {
          type: 'counter',
          suggestion: `Market analysis suggests ₹${Math.round(marketAnalysis.currentMarketRate)}/kg. Consider offering ₹${price + 2}/kg`,
          reason: `Based on ${marketAnalysis.trend} market trend with ${Math.round(marketAnalysis.confidence * 100)}% confidence`,
          marketData: marketAnalysis,
          priority: 'high'
        }
      } else {
        return {
          type: 'accept',
          suggestion: `Competitive pricing! Market rate is ₹${Math.round(marketAnalysis.currentMarketRate)}/kg`,
          reason: `Your price aligns with current market conditions`,
          marketData: marketAnalysis,
          priority: 'medium'
        }
      }
    }
    return null
  }, [])

  // Advanced scroll management
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      })
    }
  }, [messages])

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

  if (!type) {
    return <PageLoader message="Loading dashboard..." />
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

        {/* Main Layout */}
        <div className="relative z-10 flex h-screen">
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className={`${sidebarCollapsed ? 'w-20' : 'w-80'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-lg`}
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-saffron-subtle to-green-subtle">
              <div className="flex items-center justify-between">
                {!sidebarCollapsed && (
                  <div className="flex items-center space-x-3">
                    <div className="chakra-glow">
                      <AshokaChakra size={32} />
                    </div>
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
                  { id: 'dashboard', icon: BarChart3, label: 'Dashboard', labelHi: 'डैशबोर्ड' },
                  { id: 'products', icon: Package, label: 'My Products', labelHi: 'मेरे उत्पाद' },
                  { id: 'orders', icon: Briefcase, label: 'Orders', labelHi: 'ऑर्डर' },
                  { id: 'chat', icon: MessageCircle, label: 'Chat', labelHi: 'चैट' },
                  { id: 'impact', icon: Heart, label: 'Impact & Stories', labelHi: 'प्रभाव और कहानियां' },
                  { id: 'analytics', icon: BarChart3, label: 'Analytics', labelHi: 'विश्लेषण' },
                  { id: 'settings', icon: Settings, label: 'Settings', labelHi: 'सेटिंग्स' }
                ] : [
                  { id: 'dashboard', icon: ShoppingCart, label: 'Dashboard', labelHi: 'डैशबोर्ड' },
                  { id: 'browse', icon: Search, label: 'Browse Products', labelHi: 'उत्पाद खोजें' },
                  { id: 'orders', icon: Truck, label: 'My Orders', labelHi: 'मेरे ऑर्डर' },
                  { id: 'chat', icon: MessageCircle, label: 'Chat', labelHi: 'चैट' },
                  { id: 'impact', icon: Heart, label: 'Impact & Stories', labelHi: 'प्रभाव और कहानियां' },
                  { id: 'wishlist', icon: Heart, label: 'Wishlist', labelHi: 'पसंदीदा' },
                  { id: 'settings', icon: Settings, label: 'Settings', labelHi: 'सेटिंग्स' }
                ]).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-saffron-subtle to-green-subtle text-gray-900 border border-saffron/30'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {!sidebarCollapsed && (
                      <span className="font-medium">
                        {selectedLanguage === 'hi' ? item.labelHi : item.label}
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
          <main className="flex-1 flex flex-col">
            {/* Clean Modern Header */}
            <header className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedLanguage === 'hi' ? config.title : config.titleEn}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Live</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Voice Toggle */}
                  <button
                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                    className={`p-2 rounded-lg transition-colors ${
                      isVoiceEnabled 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    {isVoiceEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  {/* Price Calculator Toggle */}
                  <button
                    onClick={() => setShowPriceCalculator(!showPriceCalculator)}
                    className="btn-primary text-sm"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Price Calculator</span>
                  </button>

                  {/* Language Selector */}
                  <LanguageSelector 
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                  />
                </div>
              </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Main Dashboard Content */}
              <div className="flex-1 flex flex-col bg-gray-50">
                {activeTab === 'dashboard' && (
                  <div className="flex-1 overflow-y-auto">
                    {type === 'vendor' ? (
                      <VendorDashboard
                        selectedLanguage={selectedLanguage}
                        messages={messages}
                        currentPrice={currentPrice}
                        userStats={userStats}
                        onAddProduct={() => console.log('Add product')}
                        onEditProduct={(id) => console.log('Edit product:', id)}
                        onViewOrders={() => setActiveTab('orders')}
                      />
                    ) : (
                      <BuyerDashboard
                        selectedLanguage={selectedLanguage}
                        messages={messages}
                        currentPrice={currentPrice}
                        userStats={userStats}
                        onSearchProducts={() => console.log('Search products')}
                        onViewCart={() => console.log('View cart')}
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
                      language={selectedLanguage}
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
                  <div className="flex-1 overflow-y-auto p-6">
                    <ImpactSection selectedLanguage={selectedLanguage} />
                  </div>
                )}

                {activeTab !== 'dashboard' && activeTab !== 'chat' && activeTab !== 'impact' && (
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

              {/* Right Sidebar */}
              <AnimatePresence>
                {(showPriceCalculator || isVoiceEnabled || currentPrice) && (
                  <motion.aside
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-lg"
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
                              console.log('Generating invoice...')
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
              </AnimatePresence>
            </div>
          </main>
        </div>

        {/* Notifications Toast */}
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-xl p-4 max-w-sm shadow-xl"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  notification.type === 'error' ? 'bg-red-500' : 
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
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}