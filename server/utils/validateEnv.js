// Environment validation utility
function validateEnvironment() {
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_KEY'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:')
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`)
    })
    console.error('\nPlease check your .env file and ensure all required variables are set.')
    process.exit(1)
  }

  // Validate URLs
  try {
    new URL(process.env.SUPABASE_URL)
  } catch (error) {
    console.error('❌ Invalid SUPABASE_URL format')
    process.exit(1)
  }

  if (process.env.CLIENT_URL) {
    try {
      new URL(process.env.CLIENT_URL)
    } catch (error) {
      console.error('❌ Invalid CLIENT_URL format')
      process.exit(1)
    }
  }

  console.log('✅ Environment validation passed')
}

module.exports = { validateEnvironment }