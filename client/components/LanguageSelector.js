import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Globe, Check } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
]

export default function LanguageSelector({ selectedLanguage, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0]

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-saffron hover:shadow-saffron transition-all duration-300 min-w-[160px] group focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-4 h-4 text-gray-600 group-hover:text-saffron transition-colors" />
        <div className="flex items-center space-x-2">
          <span className="text-lg">{selectedLang.flag}</span>
          <span className="text-gray-900 font-medium group-hover:text-saffron transition-colors text-sm">
            {selectedLang.nativeName}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-600 group-hover:text-saffron transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-3">
                <div className="text-sm font-semibold text-gray-700 px-3 py-2 border-b border-gray-100 mb-2 flag-accent-horizontal">
                  Select Language / भाषा चुनें
                </div>
                {languages.map((language) => (
                  <motion.button
                    key={language.code}
                    onClick={() => {
                      onLanguageChange(language.code)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-3 py-3 rounded-xl text-sm hover:bg-gray-50 transition-all duration-200 flex items-center justify-between group ${
                      selectedLanguage === language.code 
                        ? 'bg-gradient-to-r from-saffron-subtle to-green-subtle text-gray-900 border border-saffron/30' 
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{language.flag}</span>
                      <div>
                        <div className="font-medium">{language.nativeName}</div>
                        <div className="text-xs text-gray-500">{language.name}</div>
                      </div>
                    </div>
                    {selectedLanguage === language.code && (
                      <Check className="w-4 h-4 text-saffron" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}