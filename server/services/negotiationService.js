class NegotiationService {
  constructor() {
    this.negotiationPatterns = {
      // Price-related patterns
      pricePatterns: [
        /₹(\d+)/g,
        /rupees?\s+(\d+)/gi,
        /(\d+)\s*per\s*kg/gi,
        /rate\s*is\s*(\d+)/gi,
        /price\s*(\d+)/gi
      ],
      
      // Negotiation keywords
      negotiationKeywords: {
        'too high': { type: 'price_objection', strength: 0.8 },
        'too expensive': { type: 'price_objection', strength: 0.9 },
        'costly': { type: 'price_objection', strength: 0.7 },
        'cheap': { type: 'price_positive', strength: 0.6 },
        'reasonable': { type: 'price_positive', strength: 0.7 },
        'fair': { type: 'price_positive', strength: 0.8 },
        'deal': { type: 'agreement', strength: 0.9 },
        'accept': { type: 'agreement', strength: 0.95 },
        'reject': { type: 'disagreement', strength: 0.9 },
        'no': { type: 'disagreement', strength: 0.6 }
      },

      // Hindi negotiation keywords
      hindiKeywords: {
        'महंगा': { type: 'price_objection', strength: 0.8 },
        'सस्ता': { type: 'price_positive', strength: 0.6 },
        'उचित': { type: 'price_positive', strength: 0.8 },
        'ठीक है': { type: 'agreement', strength: 0.7 },
        'मंजूर': { type: 'agreement', strength: 0.9 },
        'नहीं': { type: 'disagreement', strength: 0.6 }
      }
    }

    this.marketData = {
      averagePrices: {
        'rice': 25,
        'wheat': 22,
        'tomato': 30,
        'onion': 18,
        'potato': 15
      },
      qualityPremiums: {
        'premium': 1.3,
        'grade-a': 1.1,
        'standard': 1.0,
        'grade-c': 0.85
      }
    }
  }

  // Main method to generate negotiation suggestions
  async generateSuggestion(message, userType) {
    try {
      const analysis = this.analyzeMessage(message)
      
      if (!analysis.hasPriceContent && !analysis.hasNegotiationContent) {
        return null
      }

      const suggestion = this.createSuggestion(analysis, userType)
      return suggestion
    } catch (error) {
      console.error('Negotiation suggestion error:', error)
      return null
    }
  }

  // Analyze message for negotiation context
  analyzeMessage(message) {
    const lowerMessage = message.toLowerCase()
    
    // Extract prices
    const prices = this.extractPrices(message)
    
    // Detect negotiation sentiment
    const sentiment = this.detectSentiment(lowerMessage)
    
    // Extract crop information
    const crop = this.extractCrop(lowerMessage)
    
    // Detect quality mentions
    const quality = this.extractQuality(lowerMessage)
    
    return {
      originalMessage: message,
      prices,
      sentiment,
      crop,
      quality,
      hasPriceContent: prices.length > 0,
      hasNegotiationContent: sentiment.type !== 'neutral'
    }
  }

  // Extract price information from message
  extractPrices(message) {
    const prices = []
    
    this.negotiationPatterns.pricePatterns.forEach(pattern => {
      const matches = message.matchAll(pattern)
      for (const match of matches) {
        const price = parseInt(match[1])
        if (price && price > 0) {
          prices.push({
            value: price,
            context: match[0],
            position: match.index
          })
        }
      }
    })
    
    return prices
  }

  // Detect sentiment and negotiation intent
  detectSentiment(message) {
    let maxStrength = 0
    let detectedType = 'neutral'
    
    // Check English keywords
    Object.entries(this.negotiationPatterns.negotiationKeywords).forEach(([keyword, data]) => {
      if (message.includes(keyword) && data.strength > maxStrength) {
        maxStrength = data.strength
        detectedType = data.type
      }
    })
    
    // Check Hindi keywords
    Object.entries(this.negotiationPatterns.hindiKeywords).forEach(([keyword, data]) => {
      if (message.includes(keyword) && data.strength > maxStrength) {
        maxStrength = data.strength
        detectedType = data.type
      }
    })
    
    return {
      type: detectedType,
      strength: maxStrength,
      confidence: maxStrength > 0.5 ? 'high' : 'low'
    }
  }

  // Extract crop information
  extractCrop(message) {
    const crops = Object.keys(this.marketData.averagePrices)
    const hindiCrops = {
      'चावल': 'rice',
      'गेहूं': 'wheat',
      'टमाटर': 'tomato',
      'प्याज': 'onion',
      'आलू': 'potato'
    }
    
    // Check English crop names
    for (const crop of crops) {
      if (message.includes(crop)) {
        return crop
      }
    }
    
    // Check Hindi crop names
    for (const [hindiName, englishName] of Object.entries(hindiCrops)) {
      if (message.includes(hindiName)) {
        return englishName
      }
    }
    
    return null
  }

  // Extract quality information
  extractQuality(message) {
    const qualities = Object.keys(this.marketData.qualityPremiums)
    
    for (const quality of qualities) {
      if (message.includes(quality) || message.includes(quality.replace('-', ' '))) {
        return quality
      }
    }
    
    return 'standard'
  }

  // Create negotiation suggestion
  createSuggestion(analysis, userType) {
    const { prices, sentiment, crop, quality } = analysis
    
    if (prices.length === 0) {
      return this.createGeneralSuggestion(sentiment, userType)
    }
    
    const mentionedPrice = prices[0].value
    const marketPrice = this.getMarketPrice(crop, quality)
    
    return this.createPriceSuggestion(mentionedPrice, marketPrice, sentiment, userType, crop)
  }

  // Create general negotiation suggestion
  createGeneralSuggestion(sentiment, userType) {
    const suggestions = {
      buyer: {
        price_objection: "Ask for quality details to justify the price",
        price_positive: "Good! You can proceed with the deal",
        agreement: "Excellent! Confirm the quantity and delivery terms",
        disagreement: "Try to understand their concerns and find middle ground"
      },
      vendor: {
        price_objection: "Explain the quality and market factors affecting price",
        price_positive: "Great! Highlight the value you're providing",
        agreement: "Perfect! Confirm all deal terms",
        disagreement: "Listen to their concerns and offer alternatives"
      }
    }
    
    const suggestion = suggestions[userType]?.[sentiment.type] || "Continue the conversation to understand their needs"
    
    return {
      type: 'general',
      suggestion,
      confidence: sentiment.confidence,
      reasoning: `Based on ${sentiment.type} sentiment detected`
    }
  }

  // Create price-based suggestion
  createPriceSuggestion(mentionedPrice, marketPrice, sentiment, userType, crop) {
    const priceDifference = mentionedPrice - marketPrice
    const percentageDiff = (priceDifference / marketPrice) * 100
    
    let suggestion = ""
    let counterOffer = null
    let reasoning = ""
    
    if (userType === 'buyer') {
      if (percentageDiff > 10) {
        // Price is high
        counterOffer = Math.round(marketPrice * 1.05) // 5% above market
        suggestion = `Price seems high. Market rate is ₹${marketPrice}/kg. Consider offering ₹${counterOffer}/kg`
        reasoning = "Based on current market rates with reasonable premium"
      } else if (percentageDiff < -10) {
        // Price is low
        suggestion = `Great price! ₹${mentionedPrice}/kg is below market rate of ₹${marketPrice}/kg`
        reasoning = "Price is favorable compared to market rates"
      } else {
        // Price is fair
        suggestion = `Fair price. ₹${mentionedPrice}/kg is close to market rate of ₹${marketPrice}/kg`
        reasoning = "Price aligns with current market conditions"
      }
    } else {
      // Vendor suggestions
      if (percentageDiff > 10) {
        // Buyer thinks price is high
        suggestion = `Justify your price by explaining quality grade and market factors. Market rate is ₹${marketPrice}/kg`
        reasoning = "Help buyer understand value proposition"
      } else if (percentageDiff < -10) {
        // Price might be too low
        counterOffer = Math.round(marketPrice * 0.95) // 5% below market
        suggestion = `Consider asking ₹${counterOffer}/kg. Your current price is below market rate`
        reasoning = "Ensure fair pricing for your produce"
      } else {
        suggestion = `Your price of ₹${mentionedPrice}/kg is competitive with market rate of ₹${marketPrice}/kg`
        reasoning = "Price is well-positioned in the market"
      }
    }
    
    return {
      type: 'price',
      suggestion,
      counterOffer,
      mentionedPrice,
      marketPrice,
      crop,
      confidence: 'high',
      reasoning
    }
  }

  // Get market price for crop and quality
  getMarketPrice(crop, quality = 'standard') {
    const basePrice = this.marketData.averagePrices[crop] || 25
    const qualityMultiplier = this.marketData.qualityPremiums[quality] || 1.0
    
    // Add some market variation (±5%)
    const variation = 0.95 + (Math.random() * 0.1)
    
    return Math.round(basePrice * qualityMultiplier * variation)
  }

  // Generate counter-offer
  generateCounterOffer(originalPrice, userType, crop, sentiment) {
    const marketPrice = this.getMarketPrice(crop)
    
    if (userType === 'buyer') {
      // Buyer counter-offers should be reasonable but lower
      if (originalPrice > marketPrice * 1.1) {
        return Math.round(marketPrice * 1.05) // 5% above market
      } else {
        return Math.round(originalPrice * 0.95) // 5% lower than asked
      }
    } else {
      // Vendor counter-offers should maintain profitability
      if (originalPrice < marketPrice * 0.9) {
        return Math.round(marketPrice * 0.95) // 5% below market
      } else {
        return Math.round(originalPrice * 1.02) // Slight increase
      }
    }
  }

  // Analyze negotiation history
  analyzeNegotiationHistory(messages) {
    const priceHistory = []
    const sentimentHistory = []
    
    messages.forEach(message => {
      const analysis = this.analyzeMessage(message.text)
      if (analysis.prices.length > 0) {
        priceHistory.push({
          price: analysis.prices[0].value,
          timestamp: message.timestamp,
          sender: message.sender
        })
      }
      if (analysis.sentiment.type !== 'neutral') {
        sentimentHistory.push({
          sentiment: analysis.sentiment,
          timestamp: message.timestamp,
          sender: message.sender
        })
      }
    })
    
    return {
      priceHistory,
      sentimentHistory,
      negotiationProgress: this.calculateNegotiationProgress(priceHistory, sentimentHistory)
    }
  }

  // Calculate negotiation progress
  calculateNegotiationProgress(priceHistory, sentimentHistory) {
    if (priceHistory.length < 2) {
      return { stage: 'initial', progress: 0.1 }
    }
    
    const priceConvergence = this.calculatePriceConvergence(priceHistory)
    const sentimentTrend = this.calculateSentimentTrend(sentimentHistory)
    
    let stage = 'negotiating'
    let progress = 0.5
    
    if (priceConvergence > 0.8 && sentimentTrend > 0.6) {
      stage = 'near_agreement'
      progress = 0.8
    } else if (priceConvergence < 0.3 && sentimentTrend < 0.3) {
      stage = 'stalled'
      progress = 0.2
    }
    
    return { stage, progress, priceConvergence, sentimentTrend }
  }

  // Calculate how much prices are converging
  calculatePriceConvergence(priceHistory) {
    if (priceHistory.length < 2) return 0
    
    const firstPrice = priceHistory[0].price
    const lastPrice = priceHistory[priceHistory.length - 1].price
    const maxDifference = Math.max(firstPrice, lastPrice) * 0.2 // 20% as max expected difference
    
    const actualDifference = Math.abs(firstPrice - lastPrice)
    return Math.max(0, 1 - (actualDifference / maxDifference))
  }

  // Calculate sentiment trend
  calculateSentimentTrend(sentimentHistory) {
    if (sentimentHistory.length === 0) return 0.5
    
    const positiveTypes = ['price_positive', 'agreement']
    const recentSentiments = sentimentHistory.slice(-3) // Last 3 sentiments
    
    const positiveCount = recentSentiments.filter(s => 
      positiveTypes.includes(s.sentiment.type)
    ).length
    
    return positiveCount / recentSentiments.length
  }
}

module.exports = NegotiationService