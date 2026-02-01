const axios = require('axios')

class NegotiationService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY
    this.marketData = {
      averagePrices: {
        'rice': 25,
        'wheat': 22,
        'tomato': 30,
        'onion': 18,
        'potato': 15
      }
    }
  }

  async generateSuggestion(message, userType, context = {}) {
    try {
      // Fallback to rule-based if no API key
      if (!this.geminiApiKey) {
        console.warn('⚠️ No Gemini API key found, falling back to basic rules')
        return this.generateRuleBasedSuggestion(message, userType)
      }

      const prompt = `
        You are an intelligent AI Advisor in a real-time Indian Agricultural Mandi (Marketplace).
        
        YOUR GOAL: Help the "${userType.toUpperCase()}" negotiate the best deal for "${context.crop || 'produce'}" while maintaining good business relations.
        
        MARKET CONTEXT:
        - Product: ${context.crop || 'produce'}
        - Current Market Rate: ₹${context.marketPrice || 'variable'} / kg
        - Location: ${context.location || 'Indian Mandi'}
        - Quality: ${context.quality || 'Standard'}
        
        OPPONENT'S MESSAGE: "${message}"

        STRATEGY TO USE:
        - If USER is SELLER (Vendor): Emphasize quality, freshness, and rising transport costs. Don't drop price too easily. Use terms like "fresh maal", "top quality", "market tight hai".
        - If USER is BUYER: Point out standard market rates, ask for bulk discount, or mention "other vendor offering less". Use terms like "thoda kam karo", "bulk order hai".
        - Be concise. Mandi chats are fast.
        
        OUTPUT REQUIREMENT (JSON ONLY):
        {
          "type": "counter_offer" | "accept" | "reject" | "inquiry",
          "suggestion": "Brief strategic advice (e.g., 'He is lowballing, hold firm at ₹${context.marketPrice}').",
          "response_text": "A perfect, natural text message response in English/Hinglish (e.g., 'Sir, market rate is ₹${context.marketPrice}. Quality is A1. I can do ₹${Math.round(context.marketPrice * 0.98)} for you.').",
          "sentiment": "positive" | "neutral" | "negative",
          "counter_offer_price": ${context.marketPrice ? Math.round(context.marketPrice * (userType === 'buyer' ? 0.9 : 0.98)) : 'null'}
        }
      `

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        }
      )

      const aiData = JSON.parse(response.data.candidates[0].content.parts[0].text)

      return {
        type: aiData.type,
        suggestion: aiData.suggestion,
        reasoning: aiData.response_text, // Using response_text as the 'reasoning' or 'suggested reply'
        counterOffer: aiData.counter_offer_price,
        confidence: 'high',
        isAI: true
      }

    } catch (error) {
      console.error('AI Negotiation Error:', error.message)
      return this.generateRuleBasedSuggestion(message, userType)
    }
  }

  // --- Legacy Rule-Based Fallback (Simplified) ---
  generateRuleBasedSuggestion(message, userType) {
    // Basic extraction
    const priceMatch = message.match(/(\d+)/)
    const price = priceMatch ? parseInt(priceMatch[1]) : null

    if (!price) {
      return {
        type: 'general',
        suggestion: userType === 'buyer'
          ? "Ask for the price per kg."
          : "Quote your price clearly.",
        reasoning: "No price detected in conversation.",
        confidence: 'low'
      }
    }

    // Simple logic
    const marketPrice = 30 // hardcoded fallback
    const isHigh = price > marketPrice * 1.1
    const isLow = price < marketPrice * 0.9

    if (userType === 'buyer') {
      return {
        type: 'price',
        suggestion: isHigh ? `Price is high (Market: ₹${marketPrice}). Ask for ₹${Math.round(marketPrice * 1.05)}` : "Good price!",
        counterOffer: isHigh ? Math.round(marketPrice * 1.05) : null,
        reasoning: isHigh ? "Above market rate" : "Fair value"
      }
    } else {
      // Vendor logic: Opponent is Buyer offering 'price'
      return {
        type: 'price',
        suggestion: isLow ? `Buyer offer (₹${price}) is too low. Market is ₹${marketPrice}. Counter with ₹${Math.round(marketPrice * 0.95)}` : "Good offer, accept it.",
        counterOffer: isLow ? Math.round(marketPrice * 0.95) : null,
        reasoning: isLow ? "Below market rate" : "Good profit margin"
      }
    }
  }

  // Helper for history analysis (kept simple)
  analyzeNegotiationHistory(messages) {
    return { stage: 'negotiating', progress: 0.5 }
  }
}

module.exports = NegotiationService