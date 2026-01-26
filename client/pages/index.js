import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { 
  ArrowRight,
  CheckCircle,
  LogIn,
  UserPlus,
  Store,
  ShoppingCart
} from 'lucide-react'
import PerfectFlag from '../components/PerfectFlag'
import LanguageSelector from '../components/LanguageSelector'
import AuthModal from '../components/AuthModal'
import { useSupabase } from './_app'
import { getTranslation } from '../utils/homeTranslations'
import { 
  ModernGlobe,
  ModernTrendingUp,
  ModernChat,
  ModernMic,
  ModernUsers,
  ModernShield,
  ModernZap
} from '../components/ModernIcons'

export default function Home() {
  const router = useRouter()
  const { session, loading, supabase } = useSupabase()
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [mounted, setMounted] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'login',
    userType: 'vendor'
  })

  // Allow exploration mode - all pages accessible without auth
  const isExplorationMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load user profile when session exists (only in non-exploration mode)
  useEffect(() => {
    if (session?.user && supabase && !isExplorationMode) {
      loadUserProfile()
    }
  }, [session, supabase, isExplorationMode])

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error)
        return
      }

      if (data) {
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Profile loading error:', error)
    }
  }

  // Redirect to dashboard if already logged in (optional - can be removed for demo)
  // useEffect(() => {
  //   if (session && mounted && userProfile) {
  //     router.push(`/dashboard?type=${userProfile.user_type}&lang=${selectedLanguage}`)
  //   }
  // }, [session, mounted, userProfile, router, selectedLanguage])

  const features = [
    {
      icon: <ModernGlobe size={56} />,
      title: getTranslation(selectedLanguage, 'feature1Title'),
      description: getTranslation(selectedLanguage, 'feature1Description')
    },
    {
      icon: <ModernTrendingUp size={56} />,
      title: getTranslation(selectedLanguage, 'feature2Title'),
      description: getTranslation(selectedLanguage, 'feature2Description')
    },
    {
      icon: <ModernChat size={56} />,
      title: getTranslation(selectedLanguage, 'feature3Title'),
      description: getTranslation(selectedLanguage, 'feature3Description')
    },
    {
      icon: <ModernMic size={56} />,
      title: getTranslation(selectedLanguage, 'feature4Title'),
      description: getTranslation(selectedLanguage, 'feature4Description')
    }
  ]

  const stats = [
    { number: "7", label: getTranslation(selectedLanguage, 'languages'), icon: <ModernGlobe size={36} /> },
    { number: "1000+", label: getTranslation(selectedLanguage, 'users'), icon: <ModernUsers size={36} /> },
    { number: "24/7", label: getTranslation(selectedLanguage, 'aiService'), icon: <ModernZap size={36} /> },
    { number: "100%", label: getTranslation(selectedLanguage, 'secureLabel'), icon: <ModernShield size={36} /> }
  ]

  const handleGetStarted = (type) => {
    if (isExplorationMode) {
      // Direct access to dashboard for exploration
      router.push(`/dashboard?type=${type}&lang=${selectedLanguage}`)
    } else {
      // Normal mode: show signup modal
      setAuthModal({
        isOpen: true,
        mode: 'signup',
        userType: type
      })
    }
  }

  const handleLogin = (type) => {
    if (isExplorationMode) {
      // Direct access to dashboard for exploration
      router.push(`/dashboard?type=${type}&lang=${selectedLanguage}`)
    } else {
      // Normal mode: show login modal
      setAuthModal({
        isOpen: true,
        mode: 'login',
        userType: type
      })
    }
  }

  const closeAuthModal = () => {
    setAuthModal(prev => ({ ...prev, isOpen: false }))
  }

  if (!mounted) return null

  return (
    <>
      <Head>
        <title>Multilingual Mandi - AI for Viksit Bharat 2047</title>
        <meta name="description" content="Breaking language barriers in Indian mandis with AI-powered translation and smart pricing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Clean Header */}
        <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <PerfectFlag size={58} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getTranslation(selectedLanguage, 'title')}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-4 h-1 bg-saffron rounded-full"></div>
                  <div className="w-4 h-1 bg-white border border-gray-400 rounded-full"></div>
                  <div className="w-4 h-1 bg-green rounded-full"></div>
                  <span className="text-sm text-gray-600 ml-3">{getTranslation(selectedLanguage, 'subtitle')}</span>
                </div>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
              
              {!loading && (
                <>
                  {session && !isExplorationMode ? (
                    // Show user info and logout for logged-in users (normal mode)
                    <div className="flex items-center space-x-3">
                      <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-saffron to-green rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {session.user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">
                            {userProfile?.user_type === 'vendor' ? 'Vendor' : 'Buyer'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {userProfile?.location || 'User'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut()
                          setUserProfile(null)
                        }}
                        className="btn-outline px-4 py-2 text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    // Show simple login/signup button
                    <div className="relative group">
                      <button className="btn-outline flex items-center space-x-2 px-4 py-2 text-sm">
                        <LogIn className="w-4 h-4" />
                        <span>Login / Signup</span>
                      </button>
                      
                      {/* Dropdown for login options */}
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-2">
                          <button
                            onClick={() => setAuthModal({ isOpen: true, mode: 'login', userType: 'vendor' })}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <Store className="w-4 h-4 text-saffron" />
                            <span>Vendor Login</span>
                          </button>
                          <button
                            onClick={() => setAuthModal({ isOpen: true, mode: 'login', userType: 'buyer' })}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <ShoppingCart className="w-4 h-4 text-green" />
                            <span>Buyer Login</span>
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={() => setAuthModal({ isOpen: true, mode: 'signup', userType: 'vendor' })}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <UserPlus className="w-4 h-4 text-saffron" />
                            <span>Vendor Signup</span>
                          </button>
                          <button
                            onClick={() => setAuthModal({ isOpen: true, mode: 'signup', userType: 'buyer' })}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <UserPlus className="w-4 h-4 text-green" />
                            <span>Buyer Signup</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </nav>
        </header>

        {/* Hero Section - Clean & Modern */}
        <section className="relative py-20 px-6">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center space-x-2 mb-8">
                  <div className="w-12 h-2 bg-saffron rounded-full"></div>
                  <div className="w-12 h-2 bg-white border-2 border-gray-300 rounded-full"></div>
                  <div className="w-12 h-2 bg-green rounded-full"></div>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  {session && !isDemoMode ? (
                    <>
                      <span className="text-gray-900">Welcome back!</span>
                      <br />
                      <span className="text-gradient-primary">
                        {userProfile?.user_type === 'vendor' ? 'Ready to Sell?' : 'Ready to Buy?'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-900">
                        {getTranslation(selectedLanguage, 'heroTitle1')}
                      </span>
                      <br />
                      <span className="text-gradient-primary">
                        {getTranslation(selectedLanguage, 'heroTitle2')}
                      </span>
                      <br />
                      <span className="text-gray-900">
                        {getTranslation(selectedLanguage, 'heroTitle3')}
                      </span>
                    </>
                  )}
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  {session && !isExplorationMode ? (
                    userProfile?.user_type === 'vendor' 
                      ? 'Access your vendor dashboard to manage products, view orders, and connect with buyers across India.'
                      : 'Access your buyer dashboard to browse products, place orders, and connect with vendors across India.'
                  ) : (
                    getTranslation(selectedLanguage, 'heroDescription')
                  )}
                </p>

                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                  {session && !isExplorationMode ? (
                    // Show dashboard access for logged-in users (normal mode)
                    <>
                      <motion.button
                        onClick={() => router.push(`/dashboard?type=${userProfile?.user_type || 'vendor'}&lang=${selectedLanguage}`)}
                        className="btn-tricolor w-full sm:w-auto min-w-[240px]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ModernUsers size={24} className="mr-3" />
                        <span>Go to Dashboard</span>
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </motion.button>
                    </>
                  ) : (
                    // Show main action buttons
                    <>
                      <motion.button
                        onClick={() => handleGetStarted('vendor')}
                        className="btn-tricolor w-full sm:w-auto min-w-[240px]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Store size={24} className="mr-3" />
                        <span>{getTranslation(selectedLanguage, 'vendorButton')}</span>
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </motion.button>

                      <motion.button
                        onClick={() => handleGetStarted('buyer')}
                        className="btn-secondary w-full sm:w-auto min-w-[240px]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ShoppingCart size={24} className="mr-3" />
                        <span>{getTranslation(selectedLanguage, 'buyerButton')}</span>
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </motion.button>
                    </>
                  )}
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green" />
                    <span>{getTranslation(selectedLanguage, 'secure')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green" />
                    <span>{getTranslation(selectedLanguage, 'instantTranslation')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green" />
                    <span>{getTranslation(selectedLanguage, 'freeToUse')}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section - Clean Grid */}
        <section className="py-20 px-6 bg-white">
          <div className="container mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {getTranslation(selectedLanguage, 'featuresTitle')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {getTranslation(selectedLanguage, 'featuresDescription')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center p-8 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-center mb-6">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Clean & Minimal */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="card-glass max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex justify-center mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Clean & Simple */}
        <footer className="py-12 px-6 bg-white border-t border-gray-200">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <PerfectFlag size={48} />
              <span className="text-xl font-bold text-gray-900">{getTranslation(selectedLanguage, 'title')}</span>
            </div>
            
            {/* Enhanced Flag Accent */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-1 bg-saffron rounded-full"></div>
              <div className="w-8 h-1 bg-white border-2 border-gray-300 rounded-full"></div>
              <div className="w-8 h-1 bg-green rounded-full"></div>
            </div>
            
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              {getTranslation(selectedLanguage, 'footerDescription')}
            </p>
            
            <div className="text-sm text-gray-500">
              <span>{getTranslation(selectedLanguage, 'madeWith')} </span>
              <span className="text-saffron font-medium">{getTranslation(selectedLanguage, 'viksitBharat')}</span>
            </div>
          </div>
        </footer>

        {/* Authentication Modal */}
        <AuthModal
          isOpen={authModal.isOpen}
          onClose={closeAuthModal}
          selectedLanguage={selectedLanguage}
          initialMode={authModal.mode}
          userType={authModal.userType}
        />
      </div>
    </>
  )
}