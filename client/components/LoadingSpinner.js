import { motion } from 'framer-motion'
import AshokaChakra from './AshokaChakra'

export default function LoadingSpinner({ 
  size = 'medium', 
  message = 'Loading...', 
  showMessage = true,
  className = '' 
}) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-24 h-24'
  }

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className={sizeClasses[size]}
      >
        <AshokaChakra size={size === 'small' ? 24 : size === 'medium' ? 48 : 96} animate={false} />
      </motion.div>
      
      {showMessage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-gray-600 ${textSizeClasses[size]}`}
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

export function PageLoader({ message = 'Loading Multilingual Mandi...' }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-bharat-green-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" message={message} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <p className="text-sm text-gray-500">
            Connecting you to India's digital marketplace
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export function ComponentLoader({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner size="medium" message={message} />
    </div>
  )
}