import { useState, useEffect, useRef, useCallback } from 'react'
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

// Enhanced Message component with language features
const MessageBubble = ({ message, isOwn, showTranslation, onSpeak, onRetranslate }) => {
  const { getLanguageInfo } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative ${
        isOwn
          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white ml-4'
          : 'bg-white border border-gray-200 text-gray-900 mr-4 shadow-sm'
      }`}>
        {/* Message Actions - Show on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute -top-2 ${isOwn ? 'left-0' : 'right-0'} flex items-center space-x-1 bg-white rounded-full px-2 py-1 shadow-lg border border-gray-200`}
          >
            <button
              onClick={() => onSpeak && onSpeak(message.message, message.language)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Speak"
            >
              <Volume2 className="w-3 h-3 text-gray-600" />
            </button>
            <button
              onClick={() => onRetranslate && onRetranslate(message)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Retranslate"
            >
              <RotateCcw className="w-3 h-3 text-gray-600" />
            </button>
          </motion.div>
        )}

        {/* Sender Info */}
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
            isOwn ? 'bg-white/20' : 'bg-orange-100'
          }`}>
            {isOwn ? (
              <User className="w-3 h-3" />
            ) : (
              <Bot className="w-3 h-3 text-orange-500" />
            )}
          </div>
          <span className="text-xs font-medium opacity-75">
            {isOwn ? 'You' : 'AI Assistant'}
          </span>
          <span className="text-xs opacity-60">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          {/* Language indicator */}
          <span className="text-xs opacity-60 bg-black/10 px-1 rounded">
            {getLanguageInfo(message.language).flag} {message.language.toUpperCase()}
          </span>
        </div>

        {/* Message Content */}
        <div className="space-y-2">
          <div className="font-medium">
            {message.message}
          </div>

          {/* Translation */}
          {showTranslation && message.translatedMessage && 
           message.translatedMessage !== message.message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`pt-2 border-t ${
                isOwn ? 'border-white/20' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-1 mb-1">
                <Languages className="w-3 h-3 opacity-75" />
                <span className="text-xs opacity-75">
                  Translation
                </span>
                <span className="text-xs opacity-60 bg-black/10 px-1 rounded">
                  {getLanguageInfo(message.targetLanguage || 'hi').flag}
                </span>
              </div>
              <div className="text-sm opacity-90 italic">
                {message.translatedMessage}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Language Control Panel
const LanguageControlPanel = ({ isOpen, onClose }) => {
  const { 
    globalLanguage, 
    chatTargetLanguage, 
    languages, 
    autoTranslate,
    voiceEnabled,
    changeGlobalLanguage, 
    changeChatTargetLanguage,
    smartLanguageSwitch,
    setAutoTranslate,
    setVoiceEnabled
  } = useLanguage()

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-16 right-4 bg-white border border-gray-200 rounded-xl p-4 shadow-xl z-50 min-w-[300px]"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Language Settings</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ×
        </button>
      </div>

      {/* Global Language */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          App Language (Global)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(languages).map(([code, info]) => (
            <button
              key={code}
              onClick={() => changeGlobalLanguage(code)}
              className={`p-2 rounded-lg border text-sm transition-colors ${
                globalLanguage === code
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {info.flag} {info.native}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Target Language */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chat Translation Target
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(languages).map(([code, info]) => (
            <button
              key={code}
              onClick={() => changeChatTargetLanguage(code)}
              className={`p-2 rounded-lg border text-sm transition-colors ${
                chatTargetLanguage === code
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {info.flag} {info.native}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <button
          onClick={smartLanguageSwitch}
          className="w-full bg-gradient-to-r from-orange-500 to-blue-500 text-white p-2 rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Smart Switch</span>
        </button>
      </div>

      {/* Settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Auto-translate messages</span>
          <button
            onClick={() => setAutoTranslate(!autoTranslate)}
            className={`w-10 h-6 rounded-full transition-colors ${
              autoTranslate ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              autoTranslate ? 'translate-x-5' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Voice features</span>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`w-10 h-6 rounded-full transition-colors ${
              voiceEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              voiceEnabled ? 'translate-x-5' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
// Demo messages
const DEMO_MESSAGES = [
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

// Main Chat Interface Component
export default function ChatInterface({ 
  messages: propMessages, 
  onSendMessage: propOnSendMessage, 
  currentMessage, 
  setCurrentMessage,
  language = 'en',
  userType = 'buyer',
  isConnected = true
}) {
  const { 
    globalLanguage, 
    chatTargetLanguage, 
    autoTranslate,
    addToHistory,
    detectLanguage 
  } = useLanguage()

  // Initialize translation service
  const translationService = useRef(new TranslationService())

  // Demo state
  const [demoMessages, setDemoMessages] = useState(DEMO_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [showLanguagePanel, setShowLanguagePanel] = useState(false)
  const [showTranslations, setShowTranslations] = useState(true)
  const [isTranslating, setIsTranslating] = useState(false)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  
  // Always use demo mode for better experience
  const messages = demoMessages
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  // Handle scroll to detect if user is at bottom
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100
      const isScrolledUp = scrollTop < scrollHeight - clientHeight - 50
      setShowScrollToBottom(isScrolledUp && messages.length > 3) // Show button if scrolled up and has messages
    }
  }, [messages.length])

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // Auto-scroll to bottom only if user is already at bottom or it's their own message
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      const messagesContainer = messagesContainerRef.current
      
      if (messagesContainer) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainer
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100 // 100px threshold
        
        // Auto-scroll if user is at bottom OR if it's their own message
        if (isAtBottom || lastMessage.sender === userType) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
          }, 100) // Small delay to ensure message is rendered
        }
      }
    }
  }, [messages, userType])

  // Enhanced AI send message function with real translation integration
  const handleSend = useCallback(async () => {
    if (!inputValue.trim()) return
    
    setIsTranslating(true)
    
    try {
      // Detect input language
      const detectedLang = detectLanguage(inputValue)
      
      // Translate message if auto-translate is enabled and languages are different
      let translatedMessage = inputValue
      if (autoTranslate && detectedLang !== chatTargetLanguage) {
        translatedMessage = await translationService.current.translate(
          inputValue, 
          detectedLang, 
          chatTargetLanguage
        )
      }
      
      // Add user message
      const userMessage = {
        id: Date.now(),
        message: inputValue,
        translatedMessage: translatedMessage !== inputValue ? translatedMessage : null,
        sender: userType,
        timestamp: new Date(),
        language: detectedLang,
        targetLanguage: chatTargetLanguage
      }
      
      setDemoMessages(prev => [...prev, userMessage])
      
      // Add to translation history if translated
      if (translatedMessage !== inputValue) {
        addToHistory(
          inputValue, 
          translatedMessage, 
          detectedLang, 
          chatTargetLanguage
        )
      }
      
      setInputValue('')
      
      // AI Response with enhanced context awareness and real translation
      setTimeout(async () => {
        let aiResponse = "Thank you for your message!"
        
        const msgLower = inputValue.toLowerCase()
        
        if (msgLower.includes('hello') || msgLower.includes('hi') || msgLower.includes('नमस्ते')) {
          aiResponse = "Hello! How can I help you today? I have fresh vegetables available."
        } else if (msgLower.includes('tomato') || msgLower.includes('टमाटर')) {
          aiResponse = "I have fresh tomatoes available at ₹40/kg. Very good quality!"
        } else if (msgLower.includes('price') || msgLower.includes('कीमत') || msgLower.includes('rate')) {
          aiResponse = "Current market price is ₹35-45 per kg. I can offer ₹40/kg for good quality."
        } else if (msgLower.includes('delivery') || msgLower.includes('डिलीवरी')) {
          aiResponse = "Free delivery for orders above ₹500. Where is your location?"
        } else if (msgLower.includes('quality') || msgLower.includes('गुणवत्ता')) {
          aiResponse = "All our products are farm-fresh and of premium quality. Would you like to see samples?"
        } else if (msgLower.includes('buy') || msgLower.includes('खरीद')) {
          aiResponse = "Great! What quantity do you need? We offer bulk discounts for orders above 10kg."
        }
        
        // Translate AI response if needed
        let aiTranslation = aiResponse
        if (autoTranslate && chatTargetLanguage !== 'en') {
          try {
            aiTranslation = await translationService.current.translate(
              aiResponse, 
              'en', 
              chatTargetLanguage
            )
          } catch (error) {
            console.error('AI response translation error:', error)
          }
        }
        
        const responseMessage = {
          id: Date.now() + 1,
          message: aiResponse,
          translatedMessage: aiTranslation !== aiResponse ? aiTranslation : null,
          sender: userType === 'vendor' ? 'buyer' : 'vendor',
          timestamp: new Date(),
          language: 'en',
          targetLanguage: chatTargetLanguage
        }
        
        setDemoMessages(prev => [...prev, responseMessage])
        
        // Add AI response to history if translated
        if (aiTranslation !== aiResponse) {
          addToHistory(
            aiResponse, 
            aiTranslation, 
            'en', 
            chatTargetLanguage
          )
        }
      }, 1000 + Math.random() * 1000)
      
    } catch (error) {
      console.error('Translation error:', error)
      // Still add message even if translation fails
      const userMessage = {
        id: Date.now(),
        message: inputValue,
        translatedMessage: null,
        sender: userType,
        timestamp: new Date(),
        language: detectLanguage(inputValue),
        targetLanguage: chatTargetLanguage
      }
      setDemoMessages(prev => [...prev, userMessage])
      setInputValue('')
    } finally {
      setIsTranslating(false)
    }
  }, [inputValue, userType, autoTranslate, chatTargetLanguage, detectLanguage, addToHistory])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Voice and translation handlers
  const handleSpeak = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  const handleRetranslate = async (message) => {
    try {
      setIsTranslating(true)
      const newTranslation = await translationService.current.translate(
        message.message,
        message.language,
        chatTargetLanguage
      )
      
      // Update the message with new translation
      setDemoMessages(prev => prev.map(msg => 
        msg.id === message.id 
          ? { ...msg, translatedMessage: newTranslation }
          : msg
      ))
      
      // Add to history
      addToHistory(message.message, newTranslation, message.language, chatTargetLanguage)
    } catch (error) {
      console.error('Retranslation error:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Language Control Panel */}
      <AnimatePresence>
        <LanguageControlPanel 
          isOpen={showLanguagePanel} 
          onClose={() => setShowLanguagePanel(false)} 
        />
      </AnimatePresence>

      {/* Enhanced Chat Header - Fixed Height */}
      <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <Languages className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Multilingual Chat</h2>
              <p className="text-sm text-gray-600">
                {globalLanguage === 'hi' ? 'अपनी भाषा में बात करें' : 'Speak in your language'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Language Settings Button */}
            <button
              onClick={() => setShowLanguagePanel(!showLanguagePanel)}
              className="p-2 hover:bg-orange-200 rounded-lg transition-colors"
              title="Language Settings"
            >
              <Languages className="w-5 h-5 text-orange-600" />
            </button>
            
            {/* Translation Toggle */}
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className={`p-2 rounded-lg transition-colors ${
                showTranslations ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}
              title="Toggle Translations"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
            
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {globalLanguage === 'hi' ? 'AI सक्रिय' : 'AI Active'}
            </div>
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {globalLanguage.toUpperCase()} → {chatTargetLanguage.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area - Scrollable with Fixed Height */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-0 relative"
        onScroll={handleScroll}
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

        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id || index}
              message={message}
              isOwn={message.sender === userType}
              showTranslation={showTranslations && autoTranslate}
              onSpeak={handleSpeak}
              onRetranslate={handleRetranslate}
            />
          ))}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />

        {/* Scroll to Bottom Button */}
        <AnimatePresence>
          {showScrollToBottom && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToBottom}
              className="fixed bottom-24 right-6 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg z-10 flex items-center space-x-2"
              title="Scroll to bottom"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              {messages.length > 5 && (
                <span className="text-sm font-medium">
                  {globalLanguage === 'hi' ? 'नीचे जाएं' : 'New messages'}
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Input Area - Fixed at Bottom */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        {/* Quick AI Demo Buttons */}
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            onClick={async () => {
              const messageText = "Hello! I want to buy fresh tomatoes."
              let translatedText = messageText
              
              if (autoTranslate && globalLanguage !== chatTargetLanguage) {
                try {
                  setIsTranslating(true)
                  translatedText = await translationService.current.translate(
                    messageText, 
                    'en', 
                    chatTargetLanguage
                  )
                } catch (error) {
                  console.error('Demo translation error:', error)
                } finally {
                  setIsTranslating(false)
                }
              }
              
              const msg = {
                id: Date.now(),
                message: messageText,
                translatedMessage: translatedText !== messageText ? translatedText : null,
                sender: userType,
                timestamp: new Date(),
                language: 'en',
                targetLanguage: chatTargetLanguage
              };
              setDemoMessages(prev => [...prev, msg]);
              
              setTimeout(async () => {
                const responseText = "Great! Fresh tomatoes available at ₹40/kg. How much do you need?"
                let responseTranslation = responseText
                
                if (autoTranslate && chatTargetLanguage !== 'en') {
                  try {
                    responseTranslation = await translationService.current.translate(
                      responseText, 
                      'en', 
                      chatTargetLanguage
                    )
                  } catch (error) {
                    console.error('Demo response translation error:', error)
                  }
                }
                
                setDemoMessages(prev => [...prev, {
                  id: Date.now() + 1,
                  message: responseText,
                  translatedMessage: responseTranslation !== responseText ? responseTranslation : null,
                  sender: userType === 'vendor' ? 'buyer' : 'vendor',
                  timestamp: new Date(),
                  language: 'en',
                  targetLanguage: chatTargetLanguage
                }]);
              }, 1000);
            }}
            className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
            disabled={isTranslating}
          >
            🥬 AI Greeting
          </button>
          
          <button
            onClick={async () => {
              const messageText = "What's your best price for tomatoes?"
              let translatedText = messageText
              
              if (autoTranslate && globalLanguage !== chatTargetLanguage) {
                try {
                  setIsTranslating(true)
                  translatedText = await translationService.current.translate(
                    messageText, 
                    'en', 
                    chatTargetLanguage
                  )
                } catch (error) {
                  console.error('Demo translation error:', error)
                } finally {
                  setIsTranslating(false)
                }
              }
              
              const msg = {
                id: Date.now(),
                message: messageText,
                translatedMessage: translatedText !== messageText ? translatedText : null,
                sender: userType,
                timestamp: new Date(),
                language: 'en',
                targetLanguage: chatTargetLanguage
              };
              setDemoMessages(prev => [...prev, msg]);
              
              setTimeout(async () => {
                const responseText = "For bulk orders, I can offer ₹35/kg. Minimum 5kg order. Very fresh quality!"
                let responseTranslation = responseText
                
                if (autoTranslate && chatTargetLanguage !== 'en') {
                  try {
                    responseTranslation = await translationService.current.translate(
                      responseText, 
                      'en', 
                      chatTargetLanguage
                    )
                  } catch (error) {
                    console.error('Demo response translation error:', error)
                  }
                }
                
                setDemoMessages(prev => [...prev, {
                  id: Date.now() + 1,
                  message: responseText,
                  translatedMessage: responseTranslation !== responseText ? responseTranslation : null,
                  sender: userType === 'vendor' ? 'buyer' : 'vendor',
                  timestamp: new Date(),
                  language: 'en',
                  targetLanguage: chatTargetLanguage
                }]);
              }, 1200);
            }}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={isTranslating}
          >
            💰 Price Check
          </button>
          
          <button
            onClick={() => setDemoMessages(DEMO_MESSAGES)}
            className="bg-gray-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            🔄 Reset
          </button>
          
          {isTranslating && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Translating...</span>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={globalLanguage === 'hi' ? 'संदेश टाइप करें...' : 'Type your message...'}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
          />
          
          {/* SEND BUTTON - ALWAYS VISIBLE */}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTranslating}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 min-w-[100px]"
          >
            {isTranslating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>{globalLanguage === 'hi' ? 'भेजें' : 'Send'}</span>
              </>
            )}
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          {globalLanguage === 'hi' ? 'AI अनुवाद सक्रिय - वास्तविक समय में अनुवाद' : 'AI Translation Active - Real-time translation'}
          {autoTranslate && (
            <span className="ml-2 text-green-600">
              • Auto-translate: {globalLanguage.toUpperCase()} ↔ {chatTargetLanguage.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}