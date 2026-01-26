import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'

export default function VoiceInterface({ language, onVoiceMessage }) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState(null)
  const [synthesis, setSynthesis] = useState(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check for Web Speech API support
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const speechSynthesis = window.speechSynthesis
      
      if (SpeechRecognition && speechSynthesis) {
        setIsSupported(true)
        
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = true
        recognitionInstance.lang = getLanguageCode(language)
        
        recognitionInstance.onstart = () => {
          setIsListening(true)
        }
        
        recognitionInstance.onresult = (event) => {
          const current = event.resultIndex
          const transcript = event.results[current][0].transcript
          setTranscript(transcript)
          
          if (event.results[current].isFinal) {
            onVoiceMessage(transcript)
            setTranscript('')
          }
        }
        
        recognitionInstance.onend = () => {
          setIsListening(false)
        }
        
        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }
        
        setRecognition(recognitionInstance)
        setSynthesis(speechSynthesis)
      }
    }
  }, [language, onVoiceMessage])

  const getLanguageCode = (lang) => {
    const langMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'kn': 'kn-IN',
      'mr': 'mr-IN',
      'bn': 'bn-IN'
    }
    return langMap[lang] || 'en-US'
  }

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.lang = getLanguageCode(language)
      recognition.start()
    }
  }

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop()
    }
  }

  const speakText = (text) => {
    if (synthesis && !isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = getLanguageCode(language)
      utterance.rate = 0.9
      utterance.pitch = 1
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      synthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthesis && isSpeaking) {
      synthesis.cancel()
      setIsSpeaking(false)
    }
  }

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          {language === 'hi' 
            ? 'आवाज़ सुविधा इस ब्राउज़र में उपलब्ध नहीं है'
            : 'Voice features not supported in this browser'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Mic className="w-5 h-5 text-saffron-500" />
        <h3 className="font-semibold text-bharat-navy-800">
          {language === 'hi' ? 'आवाज़ सहायता' : 'Voice Assistant'}
        </h3>
      </div>

      {/* Voice Input */}
      <div className="text-center">
        <motion.button
          onClick={isListening ? stopListening : startListening}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 voice-recording' 
              : 'bg-saffron-500 hover:bg-saffron-600'
          } text-white shadow-lg`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isListening ? { scale: [1, 1.1, 1] } : {}}
          transition={isListening ? { duration: 1, repeat: Infinity } : {}}
        >
          {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </motion.button>
        
        <p className="mt-2 text-sm text-gray-600">
          {isListening 
            ? (language === 'hi' ? 'सुन रहा है...' : 'Listening...')
            : (language === 'hi' ? 'बोलने के लिए दबाएं' : 'Tap to speak')
          }
        </p>
        
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200"
          >
            <p className="text-sm text-blue-800">{transcript}</p>
          </motion.div>
        )}
      </div>

      {/* Voice Output */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {language === 'hi' ? 'आवाज़ आउटपुट' : 'Voice Output'}
          </span>
          <button
            onClick={isSpeaking ? stopSpeaking : () => speakText('नमस्ते, मैं आपकी सहायता के लिए यहाँ हूँ')}
            className={`p-2 rounded-lg transition-colors ${
              isSpeaking 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="text-xs text-gray-500">
          {language === 'hi' 
            ? 'संदेश स्वचालित रूप से बोले जाएंगे'
            : 'Messages will be spoken automatically'
          }
        </div>
      </div>

      {/* Language Info */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {language === 'hi' ? 'वर्तमान भाषा' : 'Current Language'}:
          </span>
          <span className="font-medium text-bharat-navy-800">
            {getLanguageCode(language)}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          {language === 'hi' 
            ? '• स्पष्ट और धीरे बोलें'
            : '• Speak clearly and slowly'
          }
        </p>
        <p>
          {language === 'hi' 
            ? '• शोर से दूर रहें'
            : '• Avoid background noise'
          }
        </p>
        <p>
          {language === 'hi' 
            ? '• माइक्रोफोन की अनुमति दें'
            : '• Allow microphone access'
          }
        </p>
      </div>
    </div>
  )
}