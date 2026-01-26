import { motion } from 'framer-motion'

// Simple Globe Icon
export const SimpleGlobe = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.2 }}
  >
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="40" fill="#3B82F6" opacity="0.1"/>
      <circle cx="50" cy="50" r="40" stroke="#3B82F6" strokeWidth="2" fill="none"/>
      <path d="M20 50 Q35 30 50 50 Q65 70 80 50" stroke="#FF9933" strokeWidth="2" fill="none"/>
      <path d="M50 10 L50 90 M10 50 L90 50" stroke="#3B82F6" strokeWidth="1" opacity="0.5"/>
      <circle cx="60" cy="45" r="3" fill="#FF9933"/>
    </svg>
  </motion.div>
)

// Simple Trending Up Icon
export const SimpleTrendingUp = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.2 }}
  >
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect x="20" y="60" width="8" height="25" fill="#FF9933" rx="2"/>
      <rect x="35" y="50" width="8" height="35" fill="#FFB366" rx="2"/>
      <rect x="50" y="35" width="8" height="50" fill="#138808" rx="2"/>
      <rect x="65" y="25" width="8" height="60" fill="#16A085" rx="2"/>
      <path d="M15 70 L35 55 L55 40 L75 20 L85 15" stroke="#FFD700" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M80 10 L90 15 L85 25 Z" fill="#FFD700"/>
    </svg>
  </motion.div>
)

// Simple Chat Icon
export const SimpleChat = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.2 }}
  >
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M20 25 Q20 15 30 15 L70 15 Q80 15 80 25 L80 55 Q80 65 70 65 L35 65 L20 75 Z" 
            fill="#FFF7ED" stroke="#FF9933" strokeWidth="2"/>
      <circle cx="35" cy="40" r="3" fill="#FF9933"/>
      <circle cx="50" cy="40" r="3" fill="#FFB366"/>
      <circle cx="65" cy="40" r="3" fill="#138808"/>
      <text x="25" y="28" fontSize="8" fill="#FF9933" fontWeight="bold">हि</text>
      <text x="65" y="28" fontSize="8" fill="#138808" fontWeight="bold">EN</text>
    </svg>
  </motion.div>
)

// Simple Microphone Icon
export const SimpleMic = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.2 }}
  >
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect x="42" y="25" width="16" height="30" rx="8" fill="#E5E7EB" stroke="#1E40AF" strokeWidth="2"/>
      <rect x="48" y="60" width="4" height="15" fill="#64748B" rx="2"/>
      <rect x="40" y="73" width="20" height="4" fill="#64748B" rx="2"/>
      <path d="M25 45 Q20 50 20 55 Q20 60 25 65" stroke="#FF9933" strokeWidth="2" fill="none"/>
      <path d="M75 45 Q80 50 80 55 Q80 60 75 65" stroke="#FF9933" strokeWidth="2" fill="none"/>
      <line x1="44" y1="30" x2="56" y2="30" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
      <line x1="44" y1="35" x2="56" y2="35" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
      <line x1="44" y1="40" x2="56" y2="40" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
    </svg>
  </motion.div>
)

// Simple Users Icon
export const SimpleUsers = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.2 }}
  >
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="35" cy="35" r="10" fill="#FF9933"/>
      <path d="M20 65 Q20 50 35 50 Q50 50 50 65 L50 75 L20 75 Z" fill="#FFB366"/>
      <circle cx="65" cy="35" r="10" fill="#138808"/>
      <path d="M50 65 Q50 50 65 50 Q80 50 80 65 L80 75 L50 75 Z" fill="#16A085"/>
      <line x1="45" y1="57" x2="55" y2="57" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="50" cy="57" r="2" fill="#FFD700"/>
    </svg>
  </motion.div>
)

// Simple Shield Icon
export const SimpleShield = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.2 }}
  >
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M50 15 L25 25 L25 55 Q25 75 50 85 Q75 75 75 55 L75 25 Z" 
            fill="#3B82F6" opacity="0.1" stroke="#3B82F6" strokeWidth="2"/>
      <path d="M40 50 L47 57 L65 35" stroke="#FFD700" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </motion.div>
)

// Simple Zap Icon
export const SimpleZap = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.2 }}
  >
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M45 20 L35 50 L50 50 L40 80 L65 60 L50 60 L60 30 Z" 
            fill="#FFD700" stroke="#FF9933" strokeWidth="2"/>
      <circle cx="25" cy="30" r="2" fill="#FFD700" opacity="0.7"/>
      <circle cx="75" cy="40" r="1.5" fill="#FF9933" opacity="0.7"/>
      <circle cx="70" cy="70" r="2" fill="#138808" opacity="0.7"/>
    </svg>
  </motion.div>
)