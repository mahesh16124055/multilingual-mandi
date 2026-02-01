import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Bot,
  User,
  Languages,
  Volume2,
  RotateCcw,
  ArrowRightLeft
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import TranslationService from '../utils/translationService'
import logger from '../utils/logger'
import { MESSAGE_LIMITS } from '../utils/constants'

// Simple Message Bubble Component - Memoized for performance
const MessageBubble = React.memo(({ message, isOwn, showTranslation }) => {
  const { getLanguageInfo } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn
        ? 'bg-orange-500 text-white'
        : 'bg-white text-gray-800 border border-gray-200'
        }`}>
        <div className="flex items-center space-x-2 mb-1">
          {isOwn ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          <span className="text-xs opacity-75">
            {isOwn ? 'You' : (message.sender === 'vendor' ? 'Vendor' : 'Buyer')}
          </span>
          <span className="text-xs opacity-50">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        <p className="text-sm">{message.message}</p>

        {showTranslation && message.translatedMessage && (
          <div className={`mt-2 pt-2 border-t ${isOwn ? 'border-orange-400' : 'border-gray-200'
            }`}>
            <p className="text-xs opacity-75 italic">
              {message.translatedMessage}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.translatedMessage === nextProps.message.translatedMessage &&
    prevProps.isOwn === nextProps.isOwn &&
    prevProps.showTranslation === nextProps.showTranslation
  )
})

// Initial demo messages
const getInitialMessages = (enableDemo = true) => {
  if (!enableDemo) return []

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
}

// Main Chat Interface Component
export default function ChatInterface({
  messages: propMessages,
  onSendMessage: propOnSendMessage,
  currentMessage,
  setCurrentMessage,
  language = 'en',
  targetLanguage = 'en', // New prop: The language of the OTHER user
  userType = 'buyer',
  isConnected = true,
  enableDemo = true,
  negotiationSuggestion = null,
  setNegotiationSuggestion = () => { }
}) {
  const {
    globalLanguage,
    chatTargetLanguage,
    autoTranslate
  } = useLanguage()

  // Ensure efficient target language selection (prop > context)
  const effectiveTargetLanguage = targetLanguage !== 'en' ? targetLanguage : chatTargetLanguage


  // Local state for standalone mode
  const [localMessages, setLocalMessages] = useState(() => getInitialMessages(enableDemo))
  const [inputValue, setInputValue] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)

  // Use parent messages if provided, otherwise local
  const messages = propMessages || localMessages

  // Debug logging for messages (development only)
  useEffect(() => {
    logger.debug('Messages updated:', {
      usingPropMessages: !!propMessages,
      propMessagesCount: propMessages?.length || 0,
      localMessagesCount: localMessages.length,
      finalMessagesCount: messages.length
    })
  }, [messages, propMessages, localMessages])
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Simple message sending
  const handleSend = useCallback(async () => {
    if (!inputValue.trim()) {
      return
    }

    const messageText = inputValue.trim()

    // Validate message length
    if (messageText.length > MESSAGE_LIMITS.MAX_LENGTH) {
      logger.warn('Message exceeds maximum length')
      return
    }

    setInputValue('')

    // If parent manages messages, use parent system
    if (propOnSendMessage && setCurrentMessage) {
      setCurrentMessage(messageText)
      // Send both the text AND the target language preference
      propOnSendMessage(messageText, effectiveTargetLanguage)
      return
    }
    // Standalone mode - manage locally
    const userMessage = {
      id: Date.now(),
      message: messageText,
      translatedMessage: null,
      sender: userType,
      timestamp: new Date(),
      language: 'en'
    }

    setLocalMessages(prev => {
      const newMessages = [...prev, userMessage]
      logger.debug('Local messages updated', { count: newMessages.length })
      return newMessages
    })

    // Generate appropriate AI response based on user type
    setTimeout(() => {
      const vendorResponses = [
        "I have fresh vegetables available today!",
        "Quality is excellent, just harvested this morning.",
        "I can offer competitive prices for bulk orders."
      ]

      const buyerResponses = [
        "I'm interested in your products. What's available?",
        "Can you tell me about the quality?",
        "What are your best prices?"
      ]

      const responseType = userType === 'buyer' ? 'vendor' : 'buyer'
      const responses = userType === 'buyer' ? vendorResponses : buyerResponses
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const aiMessage = {
        id: Date.now() + 1,
        message: randomResponse,
        translatedMessage: null,
        sender: responseType,
        timestamp: new Date(),
        language: 'en'
      }

      setLocalMessages(prev => {
        const newMessages = [...prev, aiMessage]
        logger.debug('Messages after AI response', { count: newMessages.length })
        return newMessages
      })
    }, 1000)

  }, [inputValue, userType, propOnSendMessage, setCurrentMessage])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
            <Languages className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              {globalLanguage === 'hi' ? 'बातचीत' : 'Chat'}
            </h2>
            <p className="text-sm text-gray-600">
              {userType === 'buyer' ? 'Buyer' : 'Vendor'} • {isConnected ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {globalLanguage === 'hi' ? 'AI सक्रिय' : 'AI Active'}
          </div>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
            <ArrowRightLeft className="w-3 h-3" />
            {globalLanguage.toUpperCase()} ↔ {effectiveTargetLanguage.toUpperCase()}
          </span>
          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            Messages: {messages.length}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Languages className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {globalLanguage === 'hi' ? 'बातचीत शुरू करें' : 'Start the conversation'}
            </h3>
            <p className="text-gray-600">
              {globalLanguage === 'hi'
                ? 'अपनी भाषा में टाइप करें - AI तुरंत अनुवाद करेगा'
                : 'Type in your language - AI will translate instantly'
              }
            </p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender === userType}
              showTranslation={autoTranslate}
            />
          ))}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* AI Negotiation Suggestion */}
      {negotiationSuggestion && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-4 pt-2"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 shadow-sm relative">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    {globalLanguage === 'hi' ? 'AI सुझाव' : 'AI Suggestion'}
                  </h4>
                  <p className="text-sm text-blue-800 mb-2">
                    {negotiationSuggestion.suggestion || negotiationSuggestion.reasoning}
                  </p>

                  {negotiationSuggestion.counterOffer && (
                    <div className="text-xs font-medium text-blue-700 mb-2">
                      Suggested Price: ₹{negotiationSuggestion.counterOffer}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setInputValue(negotiationSuggestion.reasoning || negotiationSuggestion.suggestion)
                        setNegotiationSuggestion(null)
                      }}
                      className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {globalLanguage === 'hi' ? 'उपयोग करें' : 'Use this'}
                    </button>
                    <button
                      onClick={() => setNegotiationSuggestion(null)}
                      className="text-blue-600 text-xs px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      {globalLanguage === 'hi' ? 'खारिज करें' : 'Dismiss'}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setNegotiationSuggestion(null)}
                  className="text-gray-400 hover:text-gray-600 absolute top-2 right-2"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                globalLanguage === 'hi'
                  ? 'अपना संदेश टाइप करें...'
                  : 'Type your message...'
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows="1"
              disabled={isTranslating}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTranslating}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 min-w-[100px]"
          >
            {isTranslating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{globalLanguage === 'hi' ? 'भेजें' : 'Send'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}