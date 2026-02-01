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
        You are an expert negotiator in an Indian agricultural marketplace ("Mandi"). 
        Role: Advisor to a ${userType} (farmer/vendor or buyer)
        Context:
        - Item being discussed: ${context.crop || 'produce'}
        - Market Price: ₹${context.marketPrice || 'variable'}/kg
        - User's Goal: ${userType === 'vendor' ? 'Get the best price while maintaining relationship' : 'Get a fair deal without insulting the farmer'}
        
        Current Message received from opponent: "${message}"
        
        Task:
        1. Analyze the sentiment (Is it aggressive? Polite? A firm offer?)
        2. Suggest a specific counter-offer price (if a price was mentioned).
        3. Generate a short, cultural, polite, and persuasive response string in English (and Hindi/Hinglish if appropriate).
        
        Output JSON format:
        {
          "type": "price_objection" | "agreement" | "counter_offer" | "general",
          "suggestion": "Short advice to the user...",
          "response_text": "Suggested reply message...",
          "sentiment": "positive" | "neutral" | "negative",
          "counter_offer_price": number | null
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
      return {
        type: 'price',
        suggestion: isLow ? `Too low. Market is ₹${marketPrice}. Stick to ₹${price}` : "Good offer, accept it.",
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