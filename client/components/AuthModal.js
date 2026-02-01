import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Store, 
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react'
import { useSupabase } from '../pages/_app'
import PerfectFlag from './PerfectFlag'
import { getTranslation } from '../utils/homeTranslations'
import logger from '../utils/logger'

export default function AuthModal({ 
  isOpen, 
  onClose, 
  selectedLanguage = 'en',
  initialMode = 'login',
  userType = 'vendor'
}) {
  const { supabase } = useSupabase()
  const [mode, setMode] = useState(initialMode) // 'login', 'signup', 'forgot'
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    location: '',
    userType: userType
  })

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
        location: '',
        userType: userType
      })
      setError('')
      setSuccess('')
      setMode(initialMode)
    }
  }, [isOpen, initialMode, userType])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      return false
    }

    if (mode === 'signup') {
      if (!formData.fullName || !formData.phone || !formData.location) {
        setError('All fields are required for registration')
        return false
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return false
      }
    }

    return true
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      if (data.user) {
        // Check if user profile exists and matches selected type
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError
        }

        if (!profile) {
          // Create profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              user_type: formData.userType,
              preferred_language: selectedLanguage,
              location: '',
              phone: '',
              verified: false
            })

          if (insertError) throw insertError
        } else if (profile.user_type !== formData.userType) {
          // User exists but trying to login as different type
          setError(`This account is registered as a ${profile.user_type}. Please select the correct account type or create a new account.`)
          return
        }

        setSuccess('Login successful! Redirecting...')
        setTimeout(() => {
          onClose()
          window.location.href = `/dashboard?type=${formData.userType}&lang=${selectedLanguage}`
        }, 1500)
      }
    } catch (error) {
      logger.error('Login error:', error)
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.')
      } else {
        setError(error.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: formData.userType,
            phone: formData.phone,
            location: formData.location,
            preferred_language: selectedLanguage
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            user_type: formData.userType,
            preferred_language: selectedLanguage,
            location: formData.location,
            phone: formData.phone,
            verified: false
          })

        if (profileError) {
          logger.error('Profile creation error:', profileError)
          // Continue anyway, profile can be created later
        }

        setSuccess('Account created successfully! Please check your email to verify your account.')
        setTimeout(() => {
          setMode('login')
          setSuccess('')
        }, 3000)
      }
    } catch (error) {
      logger.error('Signup error:', error)
      setError(error.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!formData.email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      setSuccess('Password reset email sent! Please check your inbox.')
      setTimeout(() => {
        setMode('login')
        setSuccess('')
      }, 3000)
    } catch (error) {
      logger.error('Password reset error:', error)
      setError(error.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'signup':
        return formData.userType === 'vendor' ? 'Join as Vendor' : 'Join as Buyer'
      case 'forgot':
        return 'Reset Password'
      default:
        return formData.userType === 'vendor' ? 'Vendor Login' : 'Buyer Login'
    }
  }

  const getSubtitle = () => {
    switch (mode) {
      case 'signup':
        return formData.userType === 'vendor' ? 'Start selling in mandis' : 'Start buying from mandis'
      case 'forgot':
        return 'We\'ll send you a reset link'
      default:
        return formData.userType === 'vendor' ? 'Access your vendor dashboard' : 'Access your buyer dashboard'
    }
  }

  const getIcon = () => {
    return formData.userType === 'vendor' ? <Store className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-saffron to-green rounded-lg text-white">
                {getIcon()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
                <p className="text-sm text-gray-600">{getSubtitle()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Flag and Branding */}
            <div className="flex items-center justify-center mb-6">
              <PerfectFlag size={48} />
              <div className="ml-3">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-1 bg-saffron rounded-full"></div>
                  <div className="w-3 h-1 bg-white border border-gray-400 rounded-full"></div>
                  <div className="w-3 h-1 bg-green rounded-full"></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Viksit Bharat 2047</p>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700">{success}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={mode === 'signup' ? handleSignup : mode === 'forgot' ? handleForgotPassword : handleLogin}>
              {/* User Type Selection (for login and signup) */}
              {(mode === 'signup' || mode === 'login') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {mode === 'signup' ? 'I want to join as' : 'I am a'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'vendor' }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.userType === 'vendor'
                          ? 'border-saffron bg-saffron-subtle text-saffron'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Store className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Vendor</span>
                      <p className="text-xs text-gray-500 mt-1">Sell products</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'buyer' }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.userType === 'buyer'
                          ? 'border-green bg-green-subtle text-green'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Buyer</span>
                      <p className="text-xs text-gray-500 mt-1">Buy products</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Full Name (signup only) */}
              {mode === 'signup' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="input-modern pl-10"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-modern pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password (not for forgot password) */}
              {mode !== 'forgot' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input-modern pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password (signup only) */}
              {mode === 'signup' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="input-modern"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Phone (signup only) */}
              {mode === 'signup' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-modern pl-10"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Location (signup only) */}
              {mode === 'signup' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="input-modern pl-10"
                      placeholder="Enter your city/location"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-tricolor flex items-center justify-center space-x-2 mb-4"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {getIcon()}
                    <span>
                      {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Send Reset Email' : 'Sign In'}
                    </span>
                  </>
                )}
              </button>

              {/* Mode Switching */}
              <div className="text-center space-y-3">
                {mode === 'login' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-sm text-saffron hover:text-saffron-light transition-colors"
                    >
                      Forgot your password?
                    </button>
                    <div className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="text-saffron hover:text-saffron-light font-medium transition-colors"
                      >
                        Sign up here
                      </button>
                    </div>
                    
                    {/* Quick switch for wrong account type */}
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">Wrong account type?</p>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          userType: prev.userType === 'vendor' ? 'buyer' : 'vendor' 
                        }))}
                        className="text-xs text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1 mx-auto"
                      >
                        <span>Switch to {formData.userType === 'vendor' ? 'Buyer' : 'Vendor'} Login</span>
                      </button>
                    </div>
                  </>
                )}

                {mode === 'signup' && (
                  <div className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-saffron hover:text-saffron-light font-medium transition-colors"
                    >
                      Sign in here
                    </button>
                  </div>
                )}

                {mode === 'forgot' && (
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-sm text-saffron hover:text-saffron-light transition-colors"
                  >
                    Back to login
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}