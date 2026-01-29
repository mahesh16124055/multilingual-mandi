import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [globalLanguage, setGlobalLanguage] = useState('en')
  const [chatTargetLanguage, setChatTargetLanguage] = useState('hi')
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [translationHistory, setTranslationHistory] = useState([])

  // Language options with native names
  const languages = {
    'en': { name: 'English', native: 'English', flag: '🇺🇸' },
    'hi': { name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    'ta': { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    'te': { name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    'kn': { name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    'mr': { name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    'bn': { name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' }
  }

  // Auto-detect language from text
  const detectLanguage = (text) => {
    // Simple script-based detection
    if (/[\u0900-\u097F]/.test(text)) return 'hi' // Devanagari
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta' // Tamil
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te' // Telugu
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kn' // Kannada
    if (/[\u0980-\u09FF]/.test(text)) return 'bn' // Bengali
    return 'en' // Default to English
  }

  // Change global language (affects entire app)
  const changeGlobalLanguage = (langCode) => {
    setGlobalLanguage(langCode)
    // Update URL parameter
    if (typeof window !== 'undefined') {
      const url = new URL(window.location)
      url.searchParams.set('lang', langCode)
      window.history.replaceState({}, '', url)
    }
  }

  // Change chat target language (what messages get translated to)
  const changeChatTargetLanguage = (langCode) => {
    setChatTargetLanguage(langCode)
  }

  // Smart language switching
  const smartLanguageSwitch = () => {
    // If global is English, switch chat target to Hindi
    // If global is Hindi, switch chat target to English
    // This creates a natural bilingual experience
    if (globalLanguage === 'en') {
      changeChatTargetLanguage('hi')
    } else {
      changeChatTargetLanguage('en')
    }
  }

  // Add to translation history
  const addToHistory = (original, translated, fromLang, toLang) => {
    const historyItem = {
      id: Date.now(),
      original,
      translated,
      fromLang,
      toLang,
      timestamp: new Date()
    }
    setTranslationHistory(prev => [historyItem, ...prev.slice(0, 49)]) // Keep last 50
  }

  // Get language display info
  const getLanguageInfo = (langCode) => {
    return languages[langCode] || languages['en']
  }

  const value = {
    // Current languages
    globalLanguage,
    chatTargetLanguage,
    
    // Language data
    languages,
    
    // Settings
    autoTranslate,
    voiceEnabled,
    translationHistory,
    
    // Actions
    changeGlobalLanguage,
    changeChatTargetLanguage,
    smartLanguageSwitch,
    detectLanguage,
    setAutoTranslate,
    setVoiceEnabled,
    addToHistory,
    getLanguageInfo
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}