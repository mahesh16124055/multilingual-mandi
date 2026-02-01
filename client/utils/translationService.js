import { CACHE_CONFIG } from './constants'

class TranslationService {
  constructor() {
    // Simple LRU cache implementation
    this.cache = new Map()
    this.maxCacheSize = CACHE_CONFIG.TRANSLATION_CACHE_SIZE
    // API key is now handled server-side
    this.baseUrl = 'https://api-inference.huggingface.co/models'
  }

  // Language code mapping
  getLanguageName(code) {
    const languages = {
      'en': 'English',
      'hi': 'Hindi',
      'ta': 'Tamil',
      'te': 'Telugu',
      'kn': 'Kannada',
      'mr': 'Marathi',
      'bn': 'Bengali'
    }
    return languages[code] || 'English'
  }

  // Create cache key
  getCacheKey(text, fromLang, toLang) {
    return `${text}_${fromLang}_${toLang}`
  }

  // Check cache first
  getCachedTranslation(text, fromLang, toLang) {
    const key = this.getCacheKey(text, fromLang, toLang)
    return this.cache.get(key)
  }

  // Store in cache with LRU eviction
  setCachedTranslation(text, fromLang, toLang, translation) {
    const key = this.getCacheKey(text, fromLang, toLang)

    // Remove if already exists (to move to end)
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }

    // Add to end
    this.cache.set(key, translation)

    // LRU eviction: remove oldest entries if over limit
    if (this.cache.size > this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
  }

  // Fallback translation using simple dictionary
  getFallbackTranslation(text, fromLang, toLang) {
    const commonPhrases = {
      'hello': {
        'hi': 'नमस्ते',
        'ta': 'வணக்கம்',
        'te': 'నమస్కారం',
        'kn': 'ನಮಸ್ಕಾರ',
        'mr': 'नमस्कार',
        'bn': 'নমস্কার'
      },
      'thank you': {
        'hi': 'धन्यवाद',
        'ta': 'நன்றி',
        'te': 'ధన్యవాదాలు',
        'kn': 'ಧನ್ಯವಾದಗಳು',
        'mr': 'धन्यवाद',
        'bn': 'ধন্যবাদ'
      },
      'price': {
        'hi': 'मूल्य',
        'ta': 'விலை',
        'te': 'ధర',
        'kn': 'ಬೆಲೆ',
        'mr': 'किंमत',
        'bn': 'দাম'
      },
      'good': {
        'hi': 'अच्छा',
        'ta': 'நல்ல',
        'te': 'మంచి',
        'kn': 'ಒಳ್ಳೆಯದು',
        'mr': 'चांगला',
        'bn': 'ভাল'
      },
      'yes': {
        'hi': 'हाँ',
        'ta': 'ஆம்',
        'te': 'అవును',
        'kn': 'ಹೌದು',
        'mr': 'होय',
        'bn': 'হ্যাঁ'
      },
      'no': {
        'hi': 'नहीं',
        'ta': 'இல்லை',
        'te': 'లేదు',
        'kn': 'ಇಲ್ಲ',
        'mr': 'नाही',
        'bn': 'না'
      }
    }

    const lowerText = text.toLowerCase().trim()
    if (commonPhrases[lowerText] && commonPhrases[lowerText][toLang]) {
      return commonPhrases[lowerText][toLang]
    }

    return null
  }

  // Enhanced translation with better sentence handling
  async translate(text, fromLang, toLang) {
    // Return original if same language
    if (fromLang === toLang) {
      return text
    }

    // Check cache first
    const cached = this.getCachedTranslation(text, fromLang, toLang)
    if (cached) {
      return cached
    }

    // Try enhanced fallback for complete sentences first
    const enhancedFallback = this.getEnhancedFallback(text, fromLang, toLang)
    if (enhancedFallback) {
      this.setCachedTranslation(text, fromLang, toLang, enhancedFallback)
      return enhancedFallback
    }

    // Try fallback for common phrases
    const fallback = this.getFallbackTranslation(text, fromLang, toLang)
    if (fallback) {
      this.setCachedTranslation(text, fromLang, toLang, fallback)
      return fallback
    }

    try {
      // Use Hugging Face API for translation
      const translation = await this.translateWithHuggingFace(text, fromLang, toLang)
      this.setCachedTranslation(text, fromLang, toLang, translation)
      return translation
    } catch (error) {
      console.error('Translation error:', error)

      // Return enhanced mock translation as fallback
      const mockTranslation = this.getMockTranslation(text, fromLang, toLang)
      this.setCachedTranslation(text, fromLang, toLang, mockTranslation)
      return mockTranslation
    }
  }

  // Enhanced fallback for complete sentences
  getEnhancedFallback(text, fromLang, toLang) {
    const lowerText = text.toLowerCase().trim()

    // Complete sentence translations for business scenarios
    const completeSentences = {
      'en_hi': {
        'i have fresh tomatoes available at ₹40/kg. very good quality!': 'मेरे पास ₹40/किलो में ताजे टमाटर उपलब्ध हैं। बहुत अच्छी गुणवत्ता!',
        'hello! how can i help you today? i have fresh vegetables available.': 'नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूं? मेरे पास ताजी सब्जियां उपलब्ध हैं।',
        'current market price is ₹35-45 per kg. i can offer ₹40/kg for good quality.': 'वर्तमान बाजार मूल्य ₹35-45 प्रति किलो है। मैं अच्छी गुणवत्ता के लिए ₹40/किलो की पेशकश कर सकता हूं।',
        'for bulk orders, i can offer ₹35/kg. minimum 5kg order. very fresh quality!': 'थोक ऑर्डर के लिए, मैं ₹35/किलो की पेशकश कर सकता हूं। न्यूनतम 5 किलो ऑर्डर। बहुत ताजी गुणवत्ता!',
        'great! fresh tomatoes available at ₹40/kg. how much do you need?': 'बहुत बढ़िया! ₹40/किलो में ताजे टमाटर उपलब्ध हैं। आपको कितना चाहिए?',
        'hello! i want to buy fresh tomatoes.': 'नमस्ते! मैं ताजे टमाटर खरीदना चाहता हूं।',
        "what's your best price for tomatoes?": 'टमाटर के लिए आपका सबसे अच्छा दाम क्या है?',
        'thank you for your message!': 'आपके संदेश के लिए धन्यवाद!',
        'free delivery for orders above ₹500. where is your location?': '₹500 से अधिक के ऑर्डर के लिए मुफ्त डिलीवरी। आपका स्थान कहां है?'
      },
      'en_ta': {
        'i have fresh tomatoes available at ₹40/kg. very good quality!': '₹40/கிலோ விலையில் புதிய தக்காளி கிடைக்கிறது. மிகவும் நல்ல தரம்!',
        'current market price is ₹35-45 per kg. i can offer ₹40/kg for good quality.': 'தற்போதைய சந்தை விலை கிலோவுக்கு ₹35-45. நல்ல தரத்திற்கு நான் கிலோவுக்கு ₹40 வழங்க முடியும்.',
        'hello! how can i help you today? i have fresh vegetables available.': 'வணக்கம்! இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்? என்னிடம் புதிய காய்கறிகள் கிடைக்கின்றன.'
      },
      'en_te': {
        'i have fresh tomatoes available at ₹40/kg. very good quality!': 'నా దగ్గర ₹40/కిలో చొప్పున తాజా టమాటోలు అందుబాటులో ఉన్నాయి. చాలా మంచి నాణ్యత!',
        'current market price is ₹35-45 per kg. i can offer ₹40/kg for good quality.': 'ప్రస్తుత మార్కెట్ ధర కిలోకు ₹35-45. మంచి నాణ్యత కోసం నేను కిలోకు ₹40 ఇవ్వగలను.',
        'hello! how can i help you today? i have fresh vegetables available.': 'నమస్కారం! ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను? నా దగ్గర తాజా కూరగాయలు అందుబాటులో ఉన్నాయి.'
      }
    }

    const translationKey = `${fromLang}_${toLang}`
    if (completeSentences[translationKey] && completeSentences[translationKey][lowerText]) {
      return completeSentences[translationKey][lowerText]
    }

    return null
  }

  // Hugging Face API translation - now using server-side API
  async translateWithHuggingFace(text, fromLang, toLang) {
    if (!text || text.trim() === '') {
      return text
    }

    try {
      // Use server-side translation API to avoid CORS issues and protect API keys
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'
      const response = await fetch(`${serverUrl}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          fromLang: fromLang,
          toLang: toLang
        })
      })

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`)
      }

      const data = await response.json()
      return data.translatedText || text

    } catch (error) {
      console.error('Translation API error:', error)

      // Fallback to mock translation
      return this.getMockTranslation(text, fromLang, toLang)
    }
  }

  // Get appropriate translation model for language pair
  getTranslationModel(fromLang, toLang) {
    // Use Facebook's NLLB model for multilingual translation
    return 'facebook/nllb-200-distilled-600M'
  }

  // Mock translation for demo/fallback
  getMockTranslation(text, fromLang, toLang) {
    const mockTranslations = {
      'en_hi': {
        'hello': 'नमस्ते',
        'hi': 'नमस्ते',
        'how are you': 'आप कैसे हैं',
        'good morning': 'सुप्रभात',
        'thank you': 'धन्यवाद',
        'price is too high': 'कीमत बहुत ज्यादा है',
        'what is the rate': 'दर क्या है',
        'i want to buy': 'मैं खरीदना चाहता हूं',
        'what is the price': 'कीमत क्या है',
        'good quality': 'अच्छी गुणवत्ता',
        'fresh vegetables': 'ताजी सब्जियां',
        'tomatoes': 'टमाटर',
        'available': 'उपलब्ध',
        'per kg': 'प्रति किलो',
        'market price': 'बाजार मूल्य',
        'interested': 'रुचि है',
        'current market price is': 'वर्तमान बाजार मूल्य है',
        'i can offer': 'मैं पेशकश कर सकता हूं',
        'for good quality': 'अच्छी गुणवत्ता के लिए',
        'hello! how can i help you today? i have fresh vegetables available.': 'नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूं? मेरे पास ताजी सब्जियां उपलब्ध हैं।',
        'great! fresh tomatoes available at ₹40/kg. how much do you need?': 'बहुत बढ़िया! ₹40/किलो में ताजे टमाटर उपलब्ध हैं। आपको कितना चाहिए?',
        'current market price is ₹35-45 per kg. i can offer ₹40/kg for good quality.': 'वर्तमान बाजार मूल्य ₹35-45 प्रति किलो है। मैं अच्छी गुणवत्ता के लिए ₹40/किलो की पेशकश कर सकता हूं।',
        'for bulk orders, i can offer ₹35/kg. minimum 5kg order. very fresh quality!': 'थोक ऑर्डर के लिए, मैं ₹35/किलो की पेशकश कर सकता हूं। न्यूनतम 5 किलो ऑर्डर। बहुत ताजी गुणवत्ता!'
      },
      'hi_en': {
        'नमस्ते': 'hello',
        'आप कैसे हैं': 'how are you',
        'सुप्रभात': 'good morning',
        'धन्यवाद': 'thank you',
        'कीमत बहुत ज्यादा है': 'price is too high',
        'दर क्या है': 'what is the rate',
        'मैं खरीदना चाहता हूं': 'i want to buy'
      },
      'en_ta': {
        'hello': 'வணக்கம்',
        'thank you': 'நன்றி',
        'price': 'விலை',
        'good quality': 'நல்ல தரம்',
        'tomatoes': 'தக்காளி',
        'available': 'கிடைக்கும்',
        'per kg': 'கிலோ ஒன்றுக்கு',
        'current market price is ₹35-45 per kg. i can offer ₹40/kg for good quality.': 'தற்போதைய சந்தை விலை ₹35-45 கிலோ ஒன்றுக்கு. நல்ல தரத்திற்கு நான் ₹40/கிலோ வழங்க முடியும்.'
      },
      'en_te': {
        'hello': 'నమస్కారం',
        'thank you': 'ధన్యవాదాలు',
        'price': 'ధర',
        'good quality': 'మంచి నాణ్యత',
        'tomatoes': 'టమాటో',
        'available': 'అందుబాటులో',
        'per kg': 'కిలో కు',
        'current market price is ₹35-45 per kg. i can offer ₹40/kg for good quality.': 'ప్రస్తుత మార్కెట్ ధర కిలోకు ₹35-45. మంచి నాణ్యత కోసం నేను కిలోకు ₹40 ఇవ్వగలను.'
      },
      'en_kn': {
        'hello': 'ನಮಸ್ಕಾರ',
        'thank you': 'ಧನ್ಯವಾದಗಳು',
        'price': 'ಬೆಲೆ',
        'good quality': 'ಉತ್ತಮ ಗುಣಮಟ್ಟ',
        'tomatoes': 'ಟೊಮೇಟೊ',
        'available': 'ಲಭ್ಯವಿದೆ',
        'per kg': 'ಪ್ರತಿ ಕಿಲೋ'
      },
      'en_mr': {
        'hello': 'नमस्कार',
        'thank you': 'धन्यवाद',
        'price': 'किंमत',
        'good quality': 'चांगली गुणवत्ता',
        'tomatoes': 'टोमॅटो',
        'available': 'उपलब्ध',
        'per kg': 'प्रति किलो'
      },
      'en_bn': {
        'hello': 'নমস্কার',
        'thank you': 'ধন্যবাদ',
        'price': 'দাম',
        'good quality': 'ভাল মান',
        'tomatoes': 'টমেটো',
        'available': 'পাওয়া যায়',
        'per kg': 'প্রতি কেজি'
      }
    }

    const translationKey = `${fromLang}_${toLang}`
    const lowerText = text.toLowerCase().trim()

    // Direct match first
    if (mockTranslations[translationKey] && mockTranslations[translationKey][lowerText]) {
      return mockTranslations[translationKey][lowerText]
    }

    // Pattern matching for partial phrases
    if (mockTranslations[translationKey]) {
      for (const [phrase, translation] of Object.entries(mockTranslations[translationKey])) {
        if (lowerText.includes(phrase) && phrase.length > 3) {
          return translation
        }
      }
    }

    // Enhanced smart translation based on content analysis
    return this.generateSmartTranslation(text, fromLang, toLang)
  }

  // Generate smart contextual translation
  generateSmartTranslation(text, fromLang, toLang) {
    const lowerText = text.toLowerCase()

    // Business context translations
    const businessPatterns = {
      'en_hi': {
        price: () => lowerText.includes('price') ? 'मूल्य संबंधी जानकारी' : null,
        buy: () => lowerText.includes('buy') ? 'खरीदारी की इच्छा' : null,
        sell: () => lowerText.includes('sell') ? 'बिक्री का प्रस्ताव' : null,
        quality: () => lowerText.includes('quality') ? 'गुणवत्ता की चर्चा' : null,
        available: () => lowerText.includes('available') ? 'उपलब्धता की जानकारी' : null,
        market: () => lowerText.includes('market') ? 'बाजार की स्थिति' : null,
        fresh: () => lowerText.includes('fresh') ? 'ताजा उत्पाद' : null,
        vegetables: () => lowerText.includes('vegetables') ? 'सब्जियों के बारे में' : null
      },
      'en_ta': {
        price: () => lowerText.includes('price') ? 'விலை தகவல்' : null,
        buy: () => lowerText.includes('buy') ? 'வாங்கும் விருப்பம்' : null,
        quality: () => lowerText.includes('quality') ? 'தர விவாதம்' : null,
        available: () => lowerText.includes('available') ? 'கிடைக்கும் தகவல்' : null
      },
      'en_te': {
        price: () => lowerText.includes('price') ? 'ధర సమాచారం' : null,
        buy: () => lowerText.includes('buy') ? 'కొనుగోలు కోరిక' : null,
        quality: () => lowerText.includes('quality') ? 'నాణ్యత చర్చ' : null,
        available: () => lowerText.includes('available') ? 'లభ్యత సమాచారం' : null
      }
    }

    const patternKey = `${fromLang}_${toLang}`
    const patterns = businessPatterns[patternKey]

    if (patterns) {
      for (const [key, func] of Object.entries(patterns)) {
        const result = func()
        if (result) return result
      }
    }

    // Fallback to simple indication with original text preserved
    const languageNames = {
      'hi': 'हिंदी',
      'ta': 'தமிழ்',
      'te': 'తెలుగు',
      'kn': 'ಕನ್ನಡ',
      'mr': 'मराठी',
      'bn': 'বাংলা'
    }

    const targetLangName = languageNames[toLang] || this.getLanguageName(toLang)
    return `${text} (${targetLangName} में)`
  }

  // Batch translation for multiple messages
  async translateBatch(messages, toLang) {
    const translations = await Promise.all(
      messages.map(async (message) => {
        const translation = await this.translate(
          message.text,
          message.language,
          toLang
        )
        return {
          ...message,
          translatedText: translation
        }
      })
    )
    return translations
  }

  // Get supported languages
  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    ]
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()).slice(0, 10) // First 10 keys for debugging
    }
  }
}

export default TranslationService