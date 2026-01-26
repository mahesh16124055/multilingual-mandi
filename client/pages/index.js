import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { 
  Globe, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Mic, 
  Shield,
  ArrowRight,
  Star,
  Zap,
  CheckCircle,
  Play
} from 'lucide-react'
import AshokaChakra from '../components/AshokaChakra'
import LanguageSelector from '../components/LanguageSelector'

export default function Home() {
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [userType, setUserType] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "7 भारतीय भाषाएं",
      titleEn: "7 Indian Languages",
      description: "हिंदी, तमिल, तेलुगु, कन्नड़, मराठी, बंगाली और अंग्रेजी में तुरंत अनुवाद",
      descriptionEn: "Instant translation across Hindi, Tamil, Telugu, Kannada, Marathi, Bengali & English"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "स्मार्ट मूल्य निर्धारण",
      titleEn: "Smart Price Discovery",
      description: "AI द्वारा उचित बाजार मूल्य और वास्तविक समय की दरें",
      descriptionEn: "AI-powered fair market pricing with real-time rates"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "बुद्धिमान बातचीत",
      titleEn: "Intelligent Negotiation",
      description: "AI सहायक बेहतर सौदों के लिए सुझाव देता है",
      descriptionEn: "AI assistant suggests better deals and negotiations"
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "आवाज़ सहायता",
      titleEn: "Voice Support",
      description: "आसान उपयोग के लिए आवाज़ इनपुट और आउटपुट",
      descriptionEn: "Voice input and output for easy accessibility"
    }
  ]

  const stats = [
    { number: "7", label: selectedLanguage === 'hi' ? 'भाषाएं' : 'Languages', icon: <Globe className="w-5 h-5" /> },
    { number: "1000+", label: selectedLanguage === 'hi' ? 'उपयोगकर्ता' : 'Users', icon: <Users className="w-5 h-5" /> },
    { number: "24/7", label: selectedLanguage === 'hi' ? 'AI सेवा' : 'AI Service', icon: <Zap className="w-5 h-5" /> },
    { number: "100%", label: selectedLanguage === 'hi' ? 'सुरक्षित' : 'Secure', icon: <Shield className="w-5 h-5" /> }
  ]

  const handleGetStarted = (type) => {
    setUserType(type)
    router.push(`/dashboard?type=${type}&lang=${selectedLanguage}`)
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
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="chakra-subtle">
                <AshokaChakra size={40} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Multilingual Mandi
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-4 h-1 bg-saffron rounded-full"></div>
                  <div className="w-4 h-1 bg-white border border-gray-400 rounded-full"></div>
                  <div className="w-4 h-1 bg-green rounded-full"></div>
                  <span className="text-sm text-gray-600 ml-3">विकसित भारत 2047</span>
                </div>
              </div>
            </motion.div>
            
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
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
                  <span className="text-gray-900">
                    {selectedLanguage === 'hi' ? 'भाषा की' : 'Break'}
                  </span>
                  <br />
                  <span className="text-gradient-primary">
                    {selectedLanguage === 'hi' ? 'दीवार तोड़ें' : 'Language'}
                  </span>
                  <br />
                  <span className="text-gray-900">
                    {selectedLanguage === 'hi' ? '' : 'Barriers'}
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  {selectedLanguage === 'hi' 
                    ? 'AI-संचालित अनुवाद और स्मार्ट मूल्य निर्धारण के साथ भारतीय मंडियों में व्यापार को सरल बनाएं'
                    : 'Empowering Indian mandis with AI-powered translation and smart pricing for seamless trade'
                  }
                </p>

                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                  <motion.button
                    onClick={() => handleGetStarted('vendor')}
                    className="btn-tricolor w-full sm:w-auto min-w-[240px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Users className="w-5 h-5 mr-3" />
                    <span>{selectedLanguage === 'hi' ? 'मैं विक्रेता हूँ' : 'I am a Vendor'}</span>
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </motion.button>

                  <motion.button
                    onClick={() => handleGetStarted('buyer')}
                    className="btn-secondary w-full sm:w-auto min-w-[240px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-5 h-5 mr-3" />
                    <span>{selectedLanguage === 'hi' ? 'मैं खरीदार हूँ' : 'I am a Buyer'}</span>
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </motion.button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green" />
                    <span>{selectedLanguage === 'hi' ? 'सुरक्षित' : 'Secure'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green" />
                    <span>{selectedLanguage === 'hi' ? 'तुरंत अनुवाद' : 'Instant Translation'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green" />
                    <span>{selectedLanguage === 'hi' ? 'निःशुल्क' : 'Free to Use'}</span>
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
                {selectedLanguage === 'hi' ? 'मुख्य विशेषताएं' : 'Key Features'}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {selectedLanguage === 'hi' 
                  ? 'आधुनिक AI तकनीक के साथ भारतीय व्यापार को सशक्त बनाना'
                  : 'Empowering Indian trade with modern AI technology'
                }
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="card-premium group text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-saffron to-saffron-light rounded-2xl flex items-center justify-center mb-6 mx-auto text-white group-hover:scale-110 transition-transform duration-300 shadow-saffron">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {selectedLanguage === 'hi' ? feature.title : feature.titleEn}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {selectedLanguage === 'hi' ? feature.description : feature.descriptionEn}
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
                    <div className="text-saffron mb-2 flex justify-center group-hover:scale-110 transition-transform duration-300">
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
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="chakra-subtle">
                <AshokaChakra size={32} />
              </div>
              <span className="text-xl font-bold text-gray-900">Multilingual Mandi</span>
            </div>
            
            {/* Enhanced Flag Accent */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-1 bg-saffron rounded-full"></div>
              <div className="w-8 h-1 bg-white border-2 border-gray-300 rounded-full"></div>
              <div className="w-8 h-1 bg-green rounded-full"></div>
            </div>
            
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              {selectedLanguage === 'hi' 
                ? 'विकसित भारत 2047 के लिए AI-संचालित भाषाई पुल'
                : 'AI-powered linguistic bridge for Viksit Bharat 2047'
              }
            </p>
            
            <div className="text-sm text-gray-500">
              <span>Made with ❤️ for </span>
              <span className="text-saffron font-medium">Viksit Bharat</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}