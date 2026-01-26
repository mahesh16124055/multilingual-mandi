class TranslationService {
  constructor() {
    this.cache = new Map()
    this.apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY
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

  // Store in cache
  setCachedTranslation(text, fromLang, toLang, translation) {
    const key = this.getCacheKey(text, fromLang, toLang)
    this.cache.set(key, translation)
    
    // Limit cache size
    if (this.cache.size > 1000) {
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

  // Main translation method
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
      
      // Return original text with language indicator as fallback
      return `[${this.getLanguageName(fromLang)}] ${text}`
    }
  }

  // Hugging Face API translation
  async translateWithHuggingFace(text, fromLang, toLang) {
    // Check if API key is available
    if (!this.apiKey || this.apiKey === 'your_huggingface_api_key_here') {
      return this.getMockTranslation(text, fromLang, toLang)
    }

    try {
      // Use actual Hugging Face API
      const modelName = this.getTranslationModel(fromLang, toLang)
      const response = await fetch(`${this.baseUrl}/${modelName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            src_lang: fromLang,
            tgt_lang: toLang
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const result = await response.json()
      
      // Handle different response formats
      if (Array.isArray(result) && result[0]?.translation_text) {
        return result[0].translation_text
      } else if (result.translation_text) {
        return result.translation_text
      } else if (typeof result === 'string') {
        return result
      }
      
      throw new Error('Unexpected API response format')
      
    } catch (error) {
      console.error('Hugging Face API error:', error)
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
        'how are you': 'आप कैसे हैं',
        'good morning': 'सुप्रभात',
        'thank you': 'धन्यवाद',
        'price is too high': 'कीमत बहुत ज्यादा है',
        'what is the rate': 'दर क्या है',
        'i want to buy': 'मैं खरीदना चाहता हूं'
      },
      'hi_en': {
        'नमस्ते': 'hello',
        'आप कैसे हैं': 'how are you',
        'सुप्रभात': 'good morning',
        'धन्यवाद': 'thank you',
        'कीमत बहुत ज्यादा है': 'price is too high',
        'दर क्या है': 'what is the rate',
        'मैं खरीदना चाहता हूं': 'i want to buy'
      }
    }

    const translationKey = `${fromLang}_${toLang}`
    const lowerText = text.toLowerCase().trim()
    
    if (mockTranslations[translationKey] && mockTranslations[translationKey][lowerText]) {
      return mockTranslations[translationKey][lowerText]
    }

    // If no mock translation found, return a simulated translation
    return `[Translated to ${this.getLanguageName(toLang)}] ${text}`
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