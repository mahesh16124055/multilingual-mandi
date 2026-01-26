import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useSpring } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  Volume2, 
  Copy, 
  Languages, 
  MoreVertical, 
  Reply, 
  Heart, 
  Smile, 
  Image, 
  Paperclip, 
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react'

// Message status enum
const MessageStatus = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed'
}

// Message component with advanced features
const MessageBubble = ({ message, isOwn, language, onReply, onReact, onSpeak, onCopy }) => {
  const [showActions, setShowActions] = useState(false)
  const [reactions, setReactions] = useState(message.reactions || [])
  
  const getStatusIcon = () => {
    switch (message.status) {
      case MessageStatus.SENDING:
        return <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
      case MessageStatus.SENT:
        return <CheckCircle2 className="w-3 h-3 text-gray-500" />
      case MessageStatus.DELIVERED:
        return <CheckCircle2 className="w-3 h-3 text-blue-500" />
      case MessageStatus.READ:
        return <CheckCircle2 className="w-3 h-3 text-green-500" />
      case MessageStatus.FAILED:
        return <AlertCircle className="w-3 h-3 text-red-500" />
      default:
        return null
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`max-w-xs lg:max-w-md relative ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
        {/* Message Bubble */}
        <div 
          className={`relative px-6 py-4 rounded-3xl shadow-lg ${
            isOwn
              ? 'ml-4 chat-message-own'
              : 'mr-4 border border-gray-200 chat-message-other'
          }`}
          style={{
            backgroundColor: isOwn ? '#f97316 !important' : '#ffffff !important',
            color: isOwn ? '#ffffff !important' : '#000000 !important'
          }}
        >
          {/* Sender Info */}
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isOwn ? 'bg-white/20' : 'bg-saffron-subtle'
            }`}>
              {isOwn ? (
                <User className="w-3 h-3" />
              ) : (
                <Bot className="w-3 h-3 text-saffron" />
              )}
            </div>
            <span className={`text-xs font-medium`} style={{
              color: isOwn ? 'rgba(255, 255, 255, 0.8)' : '#6b7280'
            }}>
              {isOwn 
                ? (language === 'hi' ? 'आप' : 'You')
                : (message.sender === 'vendor' 
                  ? (language === 'hi' ? 'विक्रेता' : 'Vendor')
                  : (language === 'hi' ? 'खरीदार' : 'Buyer')
                )
              }
            </span>
            <span className={`text-xs`} style={{
              color: isOwn ? 'rgba(255, 255, 255, 0.6)' : '#9ca3af'
            }}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          {/* Message Content */}
          <div className="space-y-3">
            <div 
              style={{
                color: isOwn ? '#FFFFFF !important' : '#000000 !important',
                fontWeight: 'bold !important',
                fontSize: '16px !important',
                lineHeight: '1.5 !important',
                textShadow: isOwn ? '2px 2px 4px rgba(0,0,0,0.8) !important' : '1px 1px 2px rgba(255,255,255,0.8) !important',
                backgroundColor: 'transparent !important',
                padding: '4px 0 !important',
                display: 'block !important',
                zIndex: '999 !important',
                position: 'relative !important'
              }}
            >
              {message.message}
            </div>

            {/* Translation */}
            {message.translatedMessage && 
             message.translatedMessage !== message.message && (
              <div className={`pt-3 border-t ${
                isOwn ? 'border-white/20' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-1 mb-2">
                  <Languages className="w-3 h-3 opacity-75" />
                  <span className={`text-xs`} style={{
                    color: isOwn ? 'rgba(255, 255, 255, 0.8)' : '#6b7280'
                  }}>
                    {language === 'hi' ? 'अनुवाद' : 'Translation'}
                  </span>
                </div>
                <div 
                  style={{
                    color: isOwn ? '#FFFFFF !important' : '#333333 !important',
                    fontWeight: '600 !important',
                    fontSize: '14px !important',
                    lineHeight: '1.4 !important',
                    textShadow: isOwn ? '2px 2px 4px rgba(0,0,0,0.8) !important' : '1px 1px 2px rgba(255,255,255,0.8) !important',
                    backgroundColor: 'transparent !important',
                    padding: '4px 0 !important',
                    display: 'block !important',
                    zIndex: '999 !important',
                    position: 'relative !important'
                  }}
                >
                  {message.translatedMessage}
                </div>
              </div>
            )}

            {/* Message Status */}
            {isOwn && (
              <div className="flex items-center justify-end space-x-1 mt-2">
                {getStatusIcon()}
              </div>
            )}
          </div>

          {/* Reactions */}
          {reactions.length > 0 && (
            <div className="flex items-center space-x-1 mt-3 pt-2 border-t border-white/20">
              {reactions.map((reaction, index) => (
                <span key={index} className="text-sm">
                  {reaction.emoji}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute top-0 ${isOwn ? 'left-0' : 'right-0'} flex items-center space-x-1 bg-white rounded-full px-2 py-1 shadow-lg border border-gray-200`}
            >
              <button
                onClick={() => onReact(message.id, '👍')}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Like"
              >
                <Heart className="w-3 h-3 text-gray-600" />
              </button>
              <button
                onClick={() => onReply(message)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Reply"
              >
                <Reply className="w-3 h-3 text-gray-600" />
              </button>
              <button
                onClick={() => onCopy(message.message)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Copy"
              >
                <Copy className="w-3 h-3 text-gray-600" />
              </button>
              <button
                onClick={() => onSpeak(message.message, message.language || language)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Speak"
              >
                <Volume2 className="w-3 h-3 text-gray-600" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Typing indicator component
const TypingIndicator = ({ users, language }) => {
  if (users.size === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center space-x-2 px-6 py-3"
    >
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm text-gray-600">
        {language === 'hi' ? 'टाइप कर रहा है...' : 'Typing...'}
      </span>
    </motion.div>
  )
}

// AI Suggestion Component
const AISuggestion = ({ suggestion, onDismiss, onAccept, language }) => {
  if (!suggestion) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-6 mb-4 bg-white border border-saffron/30 rounded-2xl p-4 shadow-lg"
    >
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-saffron to-orange-600 rounded-full flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-semibold text-gray-900">AI Assistant</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
              suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {suggestion.priority}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{suggestion.suggestion}</p>
          <p className="text-xs text-gray-500 mb-3">{suggestion.reason}</p>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onAccept(suggestion)}
              className="btn-secondary text-sm"
            >
              {language === 'hi' ? 'स्वीकार करें' : 'Accept'}
            </button>
            <button
              onClick={onDismiss}
              className="btn-outline text-sm"
            >
              {language === 'hi' ? 'खारिज करें' : 'Dismiss'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Mock data for demo mode
const DEMO_MESSAGES = [
  {
    id: 1,
    message: "नमस्ते! मैं टमाटर बेच रहा हूं। क्या आप खरीदना चाहते हैं?",
    translatedMessage: "Hello! I'm selling tomatoes. Would you like to buy?",
    sender: "vendor",
    timestamp: new Date(Date.now() - 300000),
    status: "read",
    language: "hi"
  },
  {
    id: 2,
    message: "Hi! Yes, I'm interested. What's the price per kg?",
    translatedMessage: "हाय! हां, मुझे दिलचस्पी है। प्रति किलो क्या दाम है?",
    sender: "buyer",
    timestamp: new Date(Date.now() - 240000),
    status: "read",
    language: "en"
  },
  {
    id: 3,
    message: "₹40 प्रति किलो। बहुत अच्छी गुणवत्ता है।",
    translatedMessage: "₹40 per kg. Very good quality.",
    sender: "vendor",
    timestamp: new Date(Date.now() - 180000),
    status: "read",
    language: "hi"
  },
  {
    id: 4,
    message: "Can you do ₹35 per kg? I need 10 kg.",
    translatedMessage: "क्या आप ₹35 प्रति किलो कर सकते हैं? मुझे 10 किलो चाहिए।",
    sender: "buyer",
    timestamp: new Date(Date.now() - 120000),
    status: "read",
    language: "en"
  }
]

// Mock responses for demo
const MOCK_RESPONSES = {
  vendor: [
    "ठीक है, ₹35 प्रति किलो चलेगा। 10 किलो के लिए ₹350।",
    "आपको कब चाहिए? मैं आज शाम तक डिलीवर कर सकता हूं।",
    "पेमेंट कैसे करेंगे? UPI या कैश?",
    "धन्यवाद! आपका ऑर्डर तैयार है।"
  ],
  buyer: [
    "Great! When can you deliver?",
    "Do you accept UPI payments?",
    "Can I get a discount for bulk order?",
    "Thank you for the good service!"
  ]
}

// Main Chat Interface Component
export default function ChatInterface({ 
  messages: propMessages, 
  onSendMessage: propOnSendMessage, 
  currentMessage, 
  setCurrentMessage,
  language,
  userType,
  isConnected: propIsConnected,
  typingUsers = new Set(),
  onTyping,
  negotiationSuggestion: propNegotiationSuggestion,
  setNegotiationSuggestion: propSetNegotiationSuggestion
}) {
  // Demo mode state
  const [demoMessages, setDemoMessages] = useState(DEMO_MESSAGES)
  const [demoConnected, setDemoConnected] = useState(true)
  const [demoTyping, setDemoTyping] = useState(false)
  const [demoSuggestion, setDemoSuggestion] = useState(null)
  
  // Use demo data if no real backend connection
  const hasRealBackend = propIsConnected && propOnSendMessage && propMessages && propMessages.length > 0
  const messages = hasRealBackend ? propMessages : demoMessages
  const isConnected = true // Always enable input in demo mode
  const negotiationSuggestion = propNegotiationSuggestion || demoSuggestion
  const setNegotiationSuggestion = propSetNegotiationSuggestion || setDemoSuggestion
  
  // Mock translation service
  const mockTranslate = (text, fromLang, toLang) => {
    const translations = {
      'hi-en': {
        'नमस्ते': 'Hello',
        'धन्यवाद': 'Thank you',
        'कैसे हैं आप': 'How are you',
        'मैं ठीक हूं': 'I am fine',
        'टमाटर': 'Tomatoes',
        'प्याज': 'Onions',
        'आलू': 'Potatoes'
      },
      'en-hi': {
        'Hello': 'नमस्ते',
        'Thank you': 'धन्यवाद',
        'How are you': 'कैसे हैं आप',
        'I am fine': 'मैं ठीक हूं',
        'Tomatoes': 'टमाटर',
        'Onions': 'प्याज',
        'Potatoes': 'आलू'
      }
    }
    
    const key = `${fromLang}-${toLang}`
    const translationMap = translations[key] || {}
    
    // Simple word-by-word translation for demo
    return Object.keys(translationMap).reduce((result, word) => {
      return result.replace(new RegExp(word, 'gi'), translationMap[word])
    }, text) || text
  }
  
  // Demo send message function
  const demoSendMessage = () => {
    console.log('🚀 Demo send message called!', currentMessage)
    if (!currentMessage.trim()) return
    
    const newMessage = {
      id: Date.now(),
      message: currentMessage,
      translatedMessage: `[Hindi] ${currentMessage}`,
      sender: userType,
      timestamp: new Date(),
      status: "sent",
      language: language
    }
    
    console.log('📝 Adding new message:', newMessage)
    setDemoMessages(prev => [...prev, newMessage])
    setCurrentMessage('')
    
    // Immediate response for testing
    setTimeout(() => {
      const otherUserType = userType === 'vendor' ? 'buyer' : 'vendor'
      const responses = [
        "Thank you for your message!",
        "That sounds good to me.",
        "Let me check the price for you.",
        "I can help you with that."
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      const responseMessage = {
        id: Date.now() + 1,
        message: randomResponse,
        translatedMessage: `[Hindi] ${randomResponse}`,
        sender: otherUserType,
        timestamp: new Date(),
        status: "delivered",
        language: 'en'
      }
      
      console.log('🤖 Adding response message:', responseMessage)
      setDemoMessages(prev => [...prev, responseMessage])
    }, 1000) // Quick response
  }
  
  const onSendMessage = hasRealBackend ? propOnSendMessage : demoSendMessage
  
  console.log('Chat Interface Debug:', {
    hasRealBackend,
    propIsConnected,
    propOnSendMessage: !!propOnSendMessage,
    propMessages: propMessages?.length || 0,
    usingFunction: hasRealBackend ? 'real' : 'demo'
  })
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const [replyingTo, setReplyingTo] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [messages])

  // Handle typing indicator
  const handleInputChange = useCallback((e) => {
    console.log('Input change:', e.target.value)
    setCurrentMessage(e.target.value)
    if (onTyping) {
      onTyping()
    }
  }, [setCurrentMessage, onTyping])

  const handleSend = useCallback(() => {
    console.log('🚀 Handle send called:', currentMessage)
    
    // If no message, add a test message
    if (!currentMessage.trim()) {
      console.log('No message, adding test message')
      const testMessage = {
        id: Date.now(),
        message: "Test message from send button",
        translatedMessage: "भेजें बटन से परीक्षण संदेश",
        sender: userType,
        timestamp: new Date(),
        status: "sent",
        language: language
      }
      setDemoMessages(prev => [...prev, testMessage])
      return
    }
    
    if (currentMessage.trim() && onSendMessage) {
      console.log('Calling onSendMessage')
      onSendMessage()
      setReplyingTo(null)
    }
  }, [currentMessage, onSendMessage, userType, language, setDemoMessages])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  // Message actions
  const handleCopy = useCallback(async (text) => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text)
      }
    } catch (error) {
      console.error('Error copying message:', error)
    }
  }, [])

  const handleSpeak = useCallback((text, lang) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = getLanguageCode(lang)
        utterance.rate = 0.9
        utterance.pitch = 1
        speechSynthesis.speak(utterance)
      } catch (error) {
        console.error('Error speaking message:', error)
      }
    }
  }, [])

  const handleReply = useCallback((message) => {
    setReplyingTo(message)
    inputRef.current?.focus()
  }, [])

  const handleReact = useCallback((messageId, emoji) => {
    // Implementation for message reactions
    console.log('React to message:', messageId, emoji)
  }, [])

  const getLanguageCode = (lang) => {
    const langMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'kn': 'kn-IN',
      'mr': 'mr-IN',
      'bn': 'bn-IN'
    }
    return langMap[lang] || 'en-US'
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-saffron-subtle to-green-subtle border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-saffron to-orange-600 rounded-full flex items-center justify-center">
              <Languages className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Multilingual Chat</h2>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'अपनी भाषा में बात करें' : 'Speak in your language'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Demo Mode Indicator */}
            {!hasRealBackend && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {language === 'hi' ? 'डेमो मोड' : 'Demo Mode'}
              </div>
            )}
            
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              isConnected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium">
                {isConnected 
                  ? (language === 'hi' ? 'कनेक्टेड' : 'Connected')
                  : (language === 'hi' ? 'डिस्कनेक्टेड' : 'Disconnected')
                }
              </span>
            </div>
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {language.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-saffron to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Languages className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {language === 'hi' ? 'बातचीत शुरू करें' : 'Start the conversation'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {language === 'hi' 
                ? 'अपनी भाषा में टाइप करें - AI तुरंत अनुवाद करेगा'
                : 'Type in your language - AI will translate instantly'
              }
            </p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id || index}
              message={message}
              isOwn={message.sender === userType}
              language={language}
              onReply={handleReply}
              onReact={handleReact}
              onSpeak={handleSpeak}
              onCopy={handleCopy}
            />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {(demoTyping || typingUsers.size > 0) && (
          <TypingIndicator users={typingUsers} language={language} />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* AI Suggestion */}
      <AISuggestion
        suggestion={negotiationSuggestion}
        onDismiss={() => setNegotiationSuggestion(null)}
        onAccept={(suggestion) => {
          setCurrentMessage(suggestion.suggestion)
          setNegotiationSuggestion(null)
        }}
        language={language}
      />

      {/* Reply Preview */}
      {replyingTo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mb-4 bg-white border border-gray-200 rounded-xl p-3 border-l-4 border-saffron shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">
                {language === 'hi' ? 'जवाब दे रहे हैं' : 'Replying to'}
              </p>
              <p className="text-sm text-gray-900 truncate max-w-xs">
                {replyingTo.message}
              </p>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-6">
        {/* Simple Test Chat Buttons */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => {
              const testMessage = {
                id: Date.now(),
                message: "Hello! I'm interested in buying tomatoes.",
                translatedMessage: "नमस्ते! मुझे टमाटर खरीदने में दिलचस्पी है।",
                sender: userType,
                timestamp: new Date(),
                status: "sent",
                language: language
              }
              setDemoMessages(prev => [...prev, testMessage])
              
              // Auto response
              setTimeout(() => {
                const response = {
                  id: Date.now() + 1,
                  message: "Great! I have fresh tomatoes. ₹40 per kg.",
                  translatedMessage: "बहुत बढ़िया! मेरे पास ताजे टमाटर हैं। ₹40 प्रति किलो।",
                  sender: userType === 'vendor' ? 'buyer' : 'vendor',
                  timestamp: new Date(),
                  status: "delivered",
                  language: 'en'
                }
                setDemoMessages(prev => [...prev, response])
              }, 1000)
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            💬 Test Chat 1
          </button>
          
          <button
            onClick={() => {
              const testMessage = {
                id: Date.now(),
                message: "What's your best price for 10kg onions?",
                translatedMessage: "10 किलो प्याज के लिए आपका सबसे अच्छा दाम क्या है?",
                sender: userType,
                timestamp: new Date(),
                status: "sent",
                language: language
              }
              setDemoMessages(prev => [...prev, testMessage])
              
              // Auto response
              setTimeout(() => {
                const response = {
                  id: Date.now() + 1,
                  message: "For 10kg onions, I can give ₹25 per kg. Total ₹250.",
                  translatedMessage: "10 किलो प्याज के लिए, मैं ₹25 प्रति किलो दे सकता हूं। कुल ₹250।",
                  sender: userType === 'vendor' ? 'buyer' : 'vendor',
                  timestamp: new Date(),
                  status: "delivered",
                  language: 'en'
                }
                setDemoMessages(prev => [...prev, response])
              }, 1500)
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            🥕 Test Chat 2
          </button>
          
          <button
            onClick={() => {
              const testMessage = {
                id: Date.now(),
                message: "Can you deliver to my location?",
                translatedMessage: "क्या आप मेरे स्थान पर डिलीवर कर सकते हैं?",
                sender: userType,
                timestamp: new Date(),
                status: "sent",
                language: language
              }
              setDemoMessages(prev => [...prev, testMessage])
              
              // Auto response
              setTimeout(() => {
                const response = {
                  id: Date.now() + 1,
                  message: "Yes! Free delivery for orders above ₹500. Where is your location?",
                  translatedMessage: "हां! ₹500 से अधिक के ऑर्डर के लिए मुफ्त डिलीवरी। आपका स्थान कहां है?",
                  sender: userType === 'vendor' ? 'buyer' : 'vendor',
                  timestamp: new Date(),
                  status: "delivered",
                  language: 'en'
                }
                setDemoMessages(prev => [...prev, response])
              }, 1200)
            }}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
          >
            🚚 Test Chat 3
          </button>
          
          <button
            onClick={() => setDemoMessages(DEMO_MESSAGES)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            🔄 Reset Chat
          </button>
        </div>

        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={currentMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === 'hi' 
                    ? 'अपना संदेश टाइप करें... (Enter दबाएं भेजने के लिए)'
                    : 'Type your message... (Press Enter to send)'
                }
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent resize-none placeholder-gray-500"
                style={{
                  color: '#1f2937',
                  minHeight: '56px',
                  maxHeight: '120px'
                }}
                rows="1"
              />
              
              {/* Input Actions */}
              <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Add emoji"
                >
                  <Smile className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Send Button */}
          <button
            onClick={handleSend}
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center min-w-[60px]"
            style={{
              backgroundColor: '#f97316 !important',
              color: '#ffffff !important',
              border: 'none !important',
              display: 'flex !important',
              visibility: 'visible !important'
            }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Backup Send Button */}
        <div className="mt-2 flex justify-end">
          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
            style={{
              backgroundColor: '#3b82f6 !important',
              color: '#ffffff !important',
              display: 'block !important',
              visibility: 'visible !important'
            }}
          >
            📤 SEND MESSAGE
          </button>
        </div>

        {/* Status Bar */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>
            {language === 'hi' 
              ? 'संदेश स्वचालित रूप से अनुवादित होंगे'
              : 'Messages will be automatically translated'
            }
          </span>
          <span>
            {isConnected 
              ? (language === 'hi' ? 'रियल-टाइम चैट सक्रिय' : 'Real-time chat active')
              : (language === 'hi' ? 'पुनः कनेक्ट करने की कोशिश कर रहे हैं...' : 'Attempting to reconnect...')
            }
          </span>
        </div>
      </div>
    </div>
  )
}