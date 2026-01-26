#!/usr/bin/env node

/**
 * Interactive setup script for Hugging Face API key
 * Run with: node setup-api-key.js
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function setupApiKey() {
  console.log('🤖 Multilingual Mandi - Hugging Face API Setup\n')
  
  console.log('📋 Steps to get your API key:')
  console.log('1. Visit: https://huggingface.co/settings/tokens')
  console.log('2. Sign up/Login to your account')
  console.log('3. Click "New token"')
  console.log('4. Name: multilingual-mandi')
  console.log('5. Role: Read')
  console.log('6. Copy the generated token (starts with hf_...)\n')
  
  const apiKey = await question('🔑 Enter your Hugging Face API key: ')
  
  if (!apiKey || !apiKey.startsWith('hf_')) {
    console.log('❌ Invalid API key format. It should start with "hf_"')
    process.exit(1)
  }
  
  // Update server/.env file
  const envPath = path.join(__dirname, 'server', '.env')
  
  try {
    let envContent = fs.readFileSync(envPath, 'utf8')
    
    // Replace the API key line
    if (envContent.includes('HUGGINGFACE_API_KEY=')) {
      envContent = envContent.replace(
        /HUGGINGFACE_API_KEY=.*/,
        `HUGGINGFACE_API_KEY=${apiKey}`
      )
    } else {
      envContent += `\nHUGGINGFACE_API_KEY=${apiKey}\n`
    }
    
    fs.writeFileSync(envPath, envContent)
    
    console.log('✅ API key saved to server/.env')
    console.log('🔄 Please restart your server to apply changes')
    console.log('\nTo test your setup, run:')
    console.log('  cd server')
    console.log('  npm run test:translation')
    
  } catch (error) {
    console.log('❌ Error updating .env file:', error.message)
    console.log('\n📝 Please manually add this line to server/.env:')
    console.log(`HUGGINGFACE_API_KEY=${apiKey}`)
  }
  
  rl.close()
}

setupApiKey().catch(error => {
  console.error('❌ Setup failed:', error.message)
  rl.close()
  process.exit(1)
})