#!/usr/bin/env node

/**
 * Pre-Demo Health Check Script
 * Run this before your demo to ensure everything is working
 */

const http = require('http')
const fs = require('fs')
const path = require('path')

function checkUrl(url, port, path = '/') {
  return new Promise((resolve) => {
    const req = http.get({ hostname: 'localhost', port, path, timeout: 3000 }, (res) => {
      resolve(res.statusCode === 200)
    })
    req.on('error', () => resolve(false))
    req.on('timeout', () => {
      req.destroy()
      resolve(false)
    })
  })
}

async function runPreDemoCheck() {
  console.log('🎯 Multilingual Mandi - Pre-Demo Health Check\n')
  
  let allGood = true
  
  // Check 1: Client Server
  console.log('🌐 Checking Client Server (port 3000)...')
  const clientOk = await checkUrl('http://localhost:3000', 3000)
  if (clientOk) {
    console.log('✅ Client server is running and responsive')
  } else {
    console.log('❌ Client server not accessible')
    console.log('   Run: cd client && npm run dev')
    allGood = false
  }
  
  // Check 2: Backend Server
  console.log('🔧 Checking Backend Server (port 3001)...')
  const serverOk = await checkUrl('http://localhost:3001', 3001, '/health')
  if (serverOk) {
    console.log('✅ Backend server is running')
  } else {
    console.log('❌ Backend server not accessible')
    console.log('   Run: cd server && npm run dev')
    allGood = false
  }
  
  // Check 3: Environment Variables
  console.log('🔑 Checking Environment Configuration...')
  const envPath = path.join(__dirname, 'server', '.env')
  try {
    const envContent = fs.readFileSync(envPath, 'utf8')
    
    if (envContent.includes('HUGGINGFACE_API_KEY=hf_')) {
      console.log('✅ Hugging Face API key configured')
    } else {
      console.log('⚠️  Hugging Face API key not found (will use mock translations)')
    }
    
    if (envContent.includes('PORT=3001')) {
      console.log('✅ Server port configured correctly')
    }
  } catch (error) {
    console.log('❌ Environment file not found')
    allGood = false
  }
  
  // Check 4: Key Files Exist
  console.log('📁 Checking Key Files...')
  const keyFiles = [
    'client/package.json',
    'server/package.json',
    'client/pages/index.js',
    'client/pages/dashboard.js',
    'server/services/translationService.js'
  ]
  
  for (const file of keyFiles) {
    if (fs.existsSync(path.join(__dirname, file))) {
      console.log(`✅ ${file} - Found`)
    } else {
      console.log(`❌ ${file} - Missing`)
      allGood = false
    }
  }
  
  // Check 5: Demo URLs
  console.log('🔗 Checking Key Demo URLs...')
  const dashboardOk = await checkUrl('http://localhost:3000', 3000, '/dashboard?type=vendor&lang=en')
  if (dashboardOk) {
    console.log('✅ Dashboard URLs accessible')
  } else {
    console.log('⚠️  Dashboard may have issues (check after client starts)')
  }
  
  // Final Status
  console.log('\n' + '='.repeat(50))
  if (allGood) {
    console.log('🎉 DEMO READY! All systems are GO!')
    console.log('\n📋 Quick Demo Checklist:')
    console.log('   1. Open http://localhost:3000')
    console.log('   2. Test language switching')
    console.log('   3. Try both vendor and buyer dashboards')
    console.log('   4. Demo the chat translation feature')
    console.log('   5. Show the Impact & Stories section')
    console.log('\n🚀 Break a leg with your demo!')
  } else {
    console.log('⚠️  Some issues detected. Please fix before demo.')
    console.log('\n🔧 Common fixes:')
    console.log('   - Start client: cd client && npm run dev')
    console.log('   - Start server: cd server && npm run dev')
    console.log('   - Check .env file in server directory')
  }
  console.log('='.repeat(50))
}

// Run the check
runPreDemoCheck().catch(error => {
  console.error('❌ Health check failed:', error.message)
  process.exit(1)
})