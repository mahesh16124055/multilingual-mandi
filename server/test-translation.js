#!/usr/bin/env node

/**
 * Test script to validate Hugging Face API key and translation service
 * Run with: node test-translation.js
 */

require('dotenv').config()
const TranslationService = require('./services/translationService')

async function testTranslation() {
  console.log('🤖 Testing Hugging Face Translation Service...\n')
  
  const translator = new TranslationService()
  
  // Check if API key is configured
  if (!process.env.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY === 'your_huggingface_api_key_here') {
    console.log('❌ No Hugging Face API key found!')
    console.log('📝 Please add your API key to server/.env file:')
    console.log('   HUGGINGFACE_API_KEY=hf_your_actual_token_here\n')
    console.log('🔗 Get your API key from: https://huggingface.co/settings/tokens\n')
    process.exit(1)
  }
  
  console.log('✅ API key found:', process.env.HUGGINGFACE_API_KEY.substring(0, 10) + '...')
  
  // Test translations
  const testCases = [
    { text: 'Hello, I want to buy tomatoes', from: 'en', to: 'hi', expected: 'should contain Hindi text' },
    { text: 'What is the price per kg?', from: 'en', to: 'ta', expected: 'should contain Tamil text' },
    { text: 'Good quality rice available', from: 'en', to: 'te', expected: 'should contain Telugu text' },
    { text: 'नमस्ते, मैं टमाटर खरीदना चाहता हूं', from: 'hi', to: 'en', expected: 'should contain English text' }
  ]
  
  console.log('\n🧪 Running translation tests...\n')
  
  for (const testCase of testCases) {
    try {
      console.log(`📝 Testing: "${testCase.text}"`)
      console.log(`🔄 ${testCase.from.toUpperCase()} → ${testCase.to.toUpperCase()}`)
      
      const result = await translator.translate(testCase.text, testCase.from, testCase.to)
      
      console.log(`✅ Result: "${result}"`)
      
      // Check if it's a mock translation (contains brackets)
      if (result.includes('[') && result.includes(']')) {
        console.log('⚠️  This appears to be a mock translation (API might not be working)')
      } else {
        console.log('🎉 Real AI translation detected!')
      }
      
      console.log('---')
    } catch (error) {
      console.log(`❌ Error: ${error.message}`)
      console.log('---')
    }
  }
  
  // Test common phrases
  console.log('\n🗣️  Testing common phrases...\n')
  
  const commonTests = [
    { text: 'hello', from: 'en', to: 'hi' },
    { text: 'thank you', from: 'en', to: 'ta' },
    { text: 'price', from: 'en', to: 'te' }
  ]
  
  for (const test of commonTests) {
    const result = await translator.translate(test.text, test.from, test.to)
    console.log(`"${test.text}" (${test.from}) → "${result}" (${test.to})`)
  }
  
  // Show cache stats
  console.log('\n📊 Cache Statistics:')
  console.log(translator.getCacheStats())
  
  console.log('\n🎯 Translation service test completed!')
  console.log('💡 If you see mock translations, check your API key and internet connection.')
}

// Run the test
testTranslation().catch(error => {
  console.error('❌ Test failed:', error.message)
  process.exit(1)
})