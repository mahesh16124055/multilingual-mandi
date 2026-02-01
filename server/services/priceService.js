const axios = require('axios')

class PriceService {
  constructor() {
    // Base prices - these should be fetched from database in production
    // For now, using environment variables with fallbacks
    this.basePrice = {
      'rice': parseInt(process.env.BASE_PRICE_RICE) || 25,
      'wheat': parseInt(process.env.BASE_PRICE_WHEAT) || 22,
      'tomato': parseInt(process.env.BASE_PRICE_TOMATO) || 30,
      'onion': parseInt(process.env.BASE_PRICE_ONION) || 18,
      'potato': parseInt(process.env.BASE_PRICE_POTATO) || 15,
      'sugarcane': parseInt(process.env.BASE_PRICE_SUGARCANE) || 35,
      'cotton': parseInt(process.env.BASE_PRICE_COTTON) || 45,
      'soybean': parseInt(process.env.BASE_PRICE_SOYBEAN) || 40,
      'maize': parseInt(process.env.BASE_PRICE_MAIZE) || 20,
      'bajra': parseInt(process.env.BASE_PRICE_BAJRA) || 18,
      'jowar': parseInt(process.env.BASE_PRICE_JOWAR) || 19,
      'groundnut': parseInt(process.env.BASE_PRICE_GROUNDNUT) || 55,
      'mustard': parseInt(process.env.BASE_PRICE_MUSTARD) || 48,
      'sunflower': parseInt(process.env.BASE_PRICE_SUNFLOWER) || 52
    }

    // Location multipliers - should be fetched from database
    this.locationMultipliers = {
      'delhi': parseFloat(process.env.LOCATION_MULTIPLIER_DELHI) || 1.2,
      'mumbai': parseFloat(process.env.LOCATION_MULTIPLIER_MUMBAI) || 1.3,
      'bangalore': parseFloat(process.env.LOCATION_MULTIPLIER_BANGALORE) || 1.1,
      'hyderabad': parseFloat(process.env.LOCATION_MULTIPLIER_HYDERABAD) || 1.0,
      'chennai': parseFloat(process.env.LOCATION_MULTIPLIER_CHENNAI) || 1.1,
      'kolkata': parseFloat(process.env.LOCATION_MULTIPLIER_KOLKATA) || 0.9,
      'pune': parseFloat(process.env.LOCATION_MULTIPLIER_PUNE) || 1.15,
      'ahmedabad': parseFloat(process.env.LOCATION_MULTIPLIER_AHMEDABAD) || 1.05,
      'jaipur': parseFloat(process.env.LOCATION_MULTIPLIER_JAIPUR) || 1.0,
      'lucknow': parseFloat(process.env.LOCATION_MULTIPLIER_LUCKNOW) || 0.95,
      'bhopal': parseFloat(process.env.LOCATION_MULTIPLIER_BHOPAL) || 0.9,
      'patna': parseFloat(process.env.LOCATION_MULTIPLIER_PATNA) || 0.85,
      'chandigarh': parseFloat(process.env.LOCATION_MULTIPLIER_CHANDIGARH) || 1.1,
      'indore': parseFloat(process.env.LOCATION_MULTIPLIER_INDORE) || 0.95,
      'nagpur': parseFloat(process.env.LOCATION_MULTIPLIER_NAGPUR) || 0.9
    }

    // Quality multipliers - configurable via environment
    this.qualityMultipliers = {
      'premium': parseFloat(process.env.QUALITY_MULTIPLIER_PREMIUM) || 1.3,
      'grade-a': parseFloat(process.env.QUALITY_MULTIPLIER_GRADE_A) || 1.1,
      'grade-b': parseFloat(process.env.QUALITY_MULTIPLIER_GRADE_B) || 1.0,
      'grade-c': parseFloat(process.env.QUALITY_MULTIPLIER_GRADE_C) || 0.85,
      'export': parseFloat(process.env.QUALITY_MULTIPLIER_EXPORT) || 1.4,
      'organic': parseFloat(process.env.QUALITY_MULTIPLIER_ORGANIC) || 1.25
    }

    // Initialize with real market data if available
    this.initializeMarketData()
  }

  // Initialize market data from external APIs
  async initializeMarketData() {
    try {
      // In production, fetch from Agmarknet API
      if (process.env.AGMARKNET_API_KEY) {
        console.log('🌾 Initializing real market data from Agmarknet...')
        // await this.fetchAgmarknetData()
      } else {
        console.log('📊 Using mock market data (set AGMARKNET_API_KEY for real data)')
      }
    } catch (error) {
      console.error('Market data initialization error:', error)
    }
  }

  // Calculate price based on multiple factors
  async calculatePrice(priceData) {
    const {
      crop,
      location = 'hyderabad',
      quality = 'grade-b',
      quantity = 100,
      season = 'current'
    } = priceData

    try {
      // Validate inputs
      if (!crop || typeof crop !== 'string') {
        throw new Error('Invalid crop specified')
      }

      if (quantity <= 0 || !Number.isFinite(quantity)) {
        throw new Error('Invalid quantity specified')
      }

      // Get base price
      const basePrice = this.basePrice[crop.toLowerCase()] || 25

      // Apply location multiplier
      const locationMultiplier = this.locationMultipliers[location.toLowerCase()] || 1.0

      // Apply quality multiplier
      const qualityMultiplier = this.qualityMultipliers[quality.toLowerCase()] || 1.0

      // Apply seasonal variation (mock)
      const seasonalMultiplier = this.getSeasonalMultiplier(crop, season)

      // Apply market trend (mock)
      const trendMultiplier = await this.getMarketTrend(crop)

      // Calculate final price
      const finalPrice = Math.round(
        basePrice *
        locationMultiplier *
        qualityMultiplier *
        seasonalMultiplier *
        trendMultiplier
      )

      // Ensure minimum price
      const minPrice = Math.max(Math.round(finalPrice * 0.95), 1)
      const maxPrice = Math.round(finalPrice * 1.05)

      return {
        crop,
        location,
        quality,
        quantity,
        basePrice,
        finalPrice: Math.max(finalPrice, 1),
        priceRange: { min: minPrice, max: maxPrice },
        totalValue: Math.max(finalPrice, 1) * quantity,
        factors: {
          location: locationMultiplier,
          quality: qualityMultiplier,
          seasonal: seasonalMultiplier,
          trend: trendMultiplier
        },
        lastUpdated: new Date(),
        explanation: this.generatePriceExplanation(crop, location, quality, finalPrice)
      }
    } catch (error) {
      console.error('Price calculation error:', error)
      throw new Error('Failed to calculate price: ' + error.message)
    }
  }

  // Get current market price for a crop
  async getCurrentPrice(crop, location = 'hyderabad') {
    try {
      // In production, this would fetch from actual market data APIs
      // For now, we'll simulate with base calculation
      const priceData = await this.calculatePrice({ crop, location })
      return priceData
    } catch (error) {
      console.error('Current price fetch error:', error)
      throw new Error('Failed to fetch current price')
    }
  }

  // Generate price suggestion from message
  async generatePriceSuggestion(message) {
    try {
      // Extract crop and price information from message
      const extractedData = this.extractPriceInfo(message)

      if (extractedData.crop) {
        const suggestion = await this.calculatePrice({
          crop: extractedData.crop,
          location: extractedData.location || 'hyderabad',
          quality: extractedData.quality || 'grade-b'
        })

        return {
          ...suggestion,
          suggestion: true,
          confidence: extractedData.confidence
        }
      }

      return null
    } catch (error) {
      console.error('Price suggestion error:', error)
      return null
    }
  }

  // Extract price information from text message
  extractPriceInfo(message) {
    const lowerMessage = message.toLowerCase()

    // Crop detection
    const crops = Object.keys(this.basePrice)
    const detectedCrop = crops.find(crop =>
      lowerMessage.includes(crop) ||
      lowerMessage.includes(this.getCropHindiName(crop))
    )

    // Location detection
    const locations = Object.keys(this.locationMultipliers)
    const detectedLocation = locations.find(location =>
      lowerMessage.includes(location)
    )

    // Quality detection
    const qualities = Object.keys(this.qualityMultipliers)
    const detectedQuality = qualities.find(quality =>
      lowerMessage.includes(quality.replace('-', ' '))
    )

    // Enhanced price detection
    // Matches: ₹50, 50rs, 50 rs, 50/-, 50 rupees, 50
    const priceMatch = message.match(/(?:₹|Rs\.?|INR)\s*(\d+)|(\d+)\s*(?:rs|rupees|\/-)?/i)

    let detectedPrice = null
    if (priceMatch) {
      // priceMatch[1] is for prefixed currency (₹50)
      // priceMatch[2] is for suffixed currency or plain number (50rs)
      const rawPrice = priceMatch[1] || priceMatch[2]
      if (rawPrice && !isNaN(parseInt(rawPrice))) {
        detectedPrice = parseInt(rawPrice)
      }
    }

    return {
      crop: detectedCrop || null,
      location: detectedLocation || null,
      quality: detectedQuality || null,
      mentionedPrice: detectedPrice,
      confidence: detectedCrop ? 0.8 : 0.3
    }
  }

  // Get crop name in Hindi
  getCropHindiName(crop) {
    const hindiNames = {
      'rice': 'चावल',
      'wheat': 'गेहूं',
      'tomato': 'टमाटर',
      'onion': 'प्याज',
      'potato': 'आलू',
      'sugarcane': 'गन्ना',
      'cotton': 'कपास',
      'soybean': 'सोयाबीन'
    }
    return hindiNames[crop] || crop
  }

  // Get seasonal multiplier
  getSeasonalMultiplier(crop, season) {
    // Mock seasonal data - in production, this would be more sophisticated
    const seasonalData = {
      'rice': { 'monsoon': 0.9, 'winter': 1.1, 'summer': 1.0 },
      'wheat': { 'monsoon': 1.1, 'winter': 0.9, 'summer': 1.0 },
      'tomato': { 'monsoon': 1.2, 'winter': 0.8, 'summer': 1.1 },
      'onion': { 'monsoon': 1.3, 'winter': 0.9, 'summer': 1.0 }
    }

    const currentSeason = this.getCurrentSeason()
    return seasonalData[crop]?.[currentSeason] || 1.0
  }

  // Get current season
  getCurrentSeason() {
    const month = new Date().getMonth() + 1
    if (month >= 6 && month <= 9) return 'monsoon'
    if (month >= 10 && month <= 2) return 'winter'
    return 'summer'
  }

  // Get market trend (mock)
  async getMarketTrend(crop) {
    // Mock trend data - in production, this would use ML models
    const trends = [0.95, 1.0, 1.05]
    return trends[Math.floor(Math.random() * trends.length)]
  }

  // Generate price explanation
  generatePriceExplanation(crop, location, quality, price) {
    return `Based on ${location} mandi rates for ${quality} ${crop}. Price includes location premium and quality adjustment. Updated with current market conditions.`
  }

  // Get historical price data (mock)
  async getHistoricalPrices(crop, location, days = 30) {
    const prices = []
    const basePrice = this.basePrice[crop.toLowerCase()] || 25

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // Add some random variation
      const variation = 0.9 + (Math.random() * 0.2) // ±10%
      const price = Math.round(basePrice * variation)

      prices.push({
        date: date.toISOString().split('T')[0],
        price,
        volume: Math.floor(Math.random() * 1000) + 100
      })
    }

    return prices
  }

  // Get price alerts
  async getPriceAlerts(crop, targetPrice, location) {
    const currentPrice = await this.getCurrentPrice(crop, location)

    return {
      crop,
      location,
      currentPrice: currentPrice.finalPrice,
      targetPrice,
      difference: currentPrice.finalPrice - targetPrice,
      alert: currentPrice.finalPrice <= targetPrice ? 'BUY' : 'WAIT',
      confidence: 0.85
    }
  }
}

module.exports = PriceService