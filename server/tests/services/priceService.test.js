const PriceService = require('../../services/priceService')

describe('PriceService', () => {
  let priceService

  beforeEach(() => {
    priceService = new PriceService()
  })

  describe('calculatePrice', () => {
    test('should calculate price for valid inputs', async () => {
      const priceData = {
        crop: 'rice',
        location: 'hyderabad',
        quality: 'grade-a',
        quantity: 100
      }

      const result = await priceService.calculatePrice(priceData)

      expect(result).toHaveProperty('finalPrice')
      expect(result).toHaveProperty('totalValue')
      expect(result).toHaveProperty('priceRange')
      expect(result.finalPrice).toBeGreaterThan(0)
      expect(result.totalValue).toBe(result.finalPrice * 100)
    })

    test('should handle invalid crop gracefully', async () => {
      const priceData = {
        crop: null,
        location: 'hyderabad',
        quality: 'grade-a',
        quantity: 100
      }

      await expect(priceService.calculatePrice(priceData))
        .rejects.toThrow('Invalid crop specified')
    })

    test('should handle invalid quantity', async () => {
      const priceData = {
        crop: 'rice',
        location: 'hyderabad',
        quality: 'grade-a',
        quantity: -10
      }

      await expect(priceService.calculatePrice(priceData))
        .rejects.toThrow('Invalid quantity specified')
    })

    test('should use default values for missing parameters', async () => {
      const priceData = {
        crop: 'rice'
      }

      const result = await priceService.calculatePrice(priceData)

      expect(result.location).toBe('hyderabad')
      expect(result.quality).toBe('grade-b')
      expect(result.quantity).toBe(100)
    })

    test('should apply location multiplier correctly', async () => {
      const hyderabadPrice = await priceService.calculatePrice({
        crop: 'rice',
        location: 'hyderabad',
        quality: 'grade-b',
        quantity: 100
      })

      const mumbaiPrice = await priceService.calculatePrice({
        crop: 'rice',
        location: 'mumbai',
        quality: 'grade-b',
        quantity: 100
      })

      // Mumbai should be more expensive than Hyderabad
      expect(mumbaiPrice.finalPrice).toBeGreaterThan(hyderabadPrice.finalPrice)
    })
  })

  describe('extractPriceInfo', () => {
    test('should extract crop from English message', () => {
      const message = 'I want to sell rice at good price'
      const result = priceService.extractPriceInfo(message)

      expect(result.crop).toBe('rice')
      expect(result.confidence).toBeGreaterThan(0.5)
    })

    test('should extract crop from Hindi message', () => {
      const message = 'मैं चावल बेचना चाहता हूं'
      const result = priceService.extractPriceInfo(message)

      expect(result.crop).toBe('rice')
    })

    test('should extract price from message', () => {
      const message = 'The price is ₹25 per kg'
      const result = priceService.extractPriceInfo(message)

      expect(result.mentionedPrice).toBe(25)
    })

    test('should return null for unrecognized crops', () => {
      const message = 'I want to sell mangoes'
      const result = priceService.extractPriceInfo(message)

      expect(result.crop).toBeNull()
      expect(result.confidence).toBeLessThan(0.5)
    })
  })

  describe('getSeasonalMultiplier', () => {
    test('should return valid multiplier for known crops', () => {
      const multiplier = priceService.getSeasonalMultiplier('rice', 'monsoon')
      
      expect(typeof multiplier).toBe('number')
      expect(multiplier).toBeGreaterThan(0)
      expect(multiplier).toBeLessThan(2)
    })

    test('should return 1.0 for unknown crops', () => {
      const multiplier = priceService.getSeasonalMultiplier('unknown', 'monsoon')
      
      expect(multiplier).toBe(1.0)
    })
  })

  describe('getCurrentSeason', () => {
    test('should return valid season', () => {
      const season = priceService.getCurrentSeason()
      
      expect(['monsoon', 'winter', 'summer']).toContain(season)
    })
  })
})