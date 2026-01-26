const TranslationService = require('../../services/translationService')

describe('TranslationService', () => {
  let translationService

  beforeEach(() => {
    translationService = new TranslationService()
  })

  describe('translate', () => {
    test('should return original text for same language', async () => {
      const result = await translationService.translate('hello', 'en', 'en')
      expect(result).toBe('hello')
    })

    test('should translate common English phrases to Hindi', async () => {
      const result = await translationService.translate('hello', 'en', 'hi')
      expect(result).toBe('नमस्ते')
    })

    test('should translate common Hindi phrases to English', async () => {
      const result = await translationService.translate('नमस्ते', 'hi', 'en')
      expect(result).toBe('hello')
    })

    test('should use cache for repeated translations', async () => {
      const spy = jest.spyOn(translationService, 'translateWithAPI')
      
      await translationService.translate('hello', 'en', 'hi')
      await translationService.translate('hello', 'en', 'hi')
      
      expect(spy).toHaveBeenCalledTimes(0) // Should use common phrases, not API
    })

    test('should handle unknown phrases gracefully', async () => {
      const result = await translationService.translate('unknown phrase', 'en', 'hi')
      expect(result).toContain('unknown phrase')
    })

    test('should detect language correctly', () => {
      expect(translationService.detectLanguage('hello world')).toBe('en')
      expect(translationService.detectLanguage('नमस्ते दुनिया')).toBe('hi')
      expect(translationService.detectLanguage('வணக்கம் உலகம்')).toBe('ta')
    })
  })

  describe('translateCommonPhrase', () => {
    test('should translate price-related terms', () => {
      expect(translationService.translateCommonPhrase('price', 'en', 'hi')).toBe('मूल्य')
      expect(translationService.translateCommonPhrase('quality', 'en', 'hi')).toBe('गुणवत्ता')
    })

    test('should return null for unknown phrases', () => {
      const result = translationService.translateCommonPhrase('unknown', 'en', 'hi')
      expect(result).toBeNull()
    })
  })

  describe('getTranslationModel', () => {
    test('should return correct model for supported language pairs', () => {
      expect(translationService.getTranslationModel('en', 'hi'))
        .toBe('Helsinki-NLP/opus-mt-en-hi')
      expect(translationService.getTranslationModel('hi', 'en'))
        .toBe('Helsinki-NLP/opus-mt-hi-en')
    })

    test('should return null for unsupported language pairs', () => {
      expect(translationService.getTranslationModel('en', 'fr')).toBeNull()
    })
  })

  describe('addCustomPhrase', () => {
    test('should add custom translation phrase', () => {
      translationService.addCustomPhrase('en', 'hi', 'custom', 'कस्टम')
      
      const result = translationService.translateCommonPhrase('custom', 'en', 'hi')
      expect(result).toBe('कस्टम')
    })
  })

  describe('getTranslationConfidence', () => {
    test('should return high confidence for common phrases', () => {
      const confidence = translationService.getTranslationConfidence('hello', 'en', 'hi')
      expect(confidence).toBe(0.95)
    })

    test('should return lower confidence for unknown phrases', () => {
      const confidence = translationService.getTranslationConfidence('unknown', 'en', 'hi')
      expect(confidence).toBe(0.6)
    })
  })

  describe('cache management', () => {
    test('should clear cache', () => {
      translationService.cache.set('test', 'value')
      expect(translationService.cache.size).toBe(1)
      
      translationService.clearCache()
      expect(translationService.cache.size).toBe(0)
    })

    test('should provide cache statistics', () => {
      translationService.cache.set('test', 'value')
      const stats = translationService.getCacheStats()
      
      expect(stats).toHaveProperty('size')
      expect(stats).toHaveProperty('maxSize')
      expect(stats.size).toBe(1)
    })
  })
})