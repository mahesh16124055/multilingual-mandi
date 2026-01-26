import { motion } from 'framer-motion'

// Modern Globe Icon - Professional design
export const ModernGlobe = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block modern-icon ${className}`}
    whileHover={{ scale: 1.05, y: -2 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Globe sphere with gradient */}
      <circle 
        cx="60" cy="60" r="50" 
        fill="url(#globeGradient)" 
        stroke="url(#globeBorder)" 
        strokeWidth="2"
        filter="url(#globeShadow)"
      />
      
      {/* Continents - stylized */}
      <path 
        d="M25 45 Q35 35 50 40 Q65 45 75 35 Q85 40 90 50 Q85 65 75 70 Q60 75 45 70 Q30 65 25 45Z" 
        fill="rgba(255,153,51,0.2)" 
        stroke="#FF9933" 
        strokeWidth="1.5"
      />
      
      {/* India highlight */}
      <circle cx="65" cy="50" r="6" fill="#FF9933" opacity="0.8"/>
      
      {/* Grid lines */}
      <circle cx="60" cy="60" r="35" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <circle cx="60" cy="60" r="25" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <line x1="60" y1="10" x2="60" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <line x1="10" y1="60" x2="110" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      
      {/* Connection points */}
      <motion.circle cx="75" cy="35" r="2" fill="#FFD700"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle cx="45" cy="75" r="1.5" fill="#FFD700"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
      
      <defs>
        <radialGradient id="globeGradient" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#60A5FA"/>
          <stop offset="70%" stopColor="#3B82F6"/>
          <stop offset="100%" stopColor="#1E40AF"/>
        </radialGradient>
        <linearGradient id="globeBorder">
          <stop offset="0%" stopColor="#FF9933"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#138808"/>
        </linearGradient>
        <filter id="globeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.1"/>
        </filter>
      </defs>
    </svg>
  </motion.div>
)

// Modern Trending Up Icon
export const ModernTrendingUp = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.05, y: -2 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Background */}
      <rect width="120" height="120" fill="url(#trendBg)" opacity="0.05" rx="8"/>
      
      {/* Chart bars */}
      <motion.rect x="25" y="70" width="12" height="30" rx="6" fill="url(#bar1)"
        initial={{ height: 0, y: 100 }}
        animate={{ height: 30, y: 70 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <motion.rect x="45" y="55" width="12" height="45" rx="6" fill="url(#bar2)"
        initial={{ height: 0, y: 100 }}
        animate={{ height: 45, y: 55 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      <motion.rect x="65" y="40" width="12" height="60" rx="6" fill="url(#bar3)"
        initial={{ height: 0, y: 100 }}
        animate={{ height: 60, y: 40 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.rect x="85" y="25" width="12" height="75" rx="6" fill="url(#bar4)"
        initial={{ height: 0, y: 100 }}
        animate={{ height: 75, y: 25 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      />
      
      {/* Trend line */}
      <motion.path 
        d="M20 85 L37 70 L57 55 L77 40 L97 20" 
        stroke="url(#trendLine)" 
        strokeWidth="3" 
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      />
      
      {/* Arrow */}
      <motion.path 
        d="M92 15 L102 20 L97 30 Z" 
        fill="#FFD700"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      />
      
      <defs>
        <linearGradient id="trendBg">
          <stop offset="0%" stopColor="#10B981"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
        <linearGradient id="bar1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF9933"/>
          <stop offset="100%" stopColor="#FF7A00"/>
        </linearGradient>
        <linearGradient id="bar2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFB366"/>
          <stop offset="100%" stopColor="#FF9933"/>
        </linearGradient>
        <linearGradient id="bar3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#138808"/>
          <stop offset="100%" stopColor="#0F7A06"/>
        </linearGradient>
        <linearGradient id="bar4" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#16A085"/>
          <stop offset="100%" stopColor="#138808"/>
        </linearGradient>
        <linearGradient id="trendLine">
          <stop offset="0%" stopColor="#FF9933"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#138808"/>
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
)

// Modern Chat Icon
export const ModernChat = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.05, y: -2 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Main bubble */}
      <motion.path 
        d="M25 30 Q25 20 35 20 L85 20 Q95 20 95 30 L95 65 Q95 75 85 75 L45 75 L25 90 Z" 
        fill="url(#chatBubble)" 
        stroke="url(#chatBorder)" 
        strokeWidth="2"
        filter="url(#chatShadow)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Secondary bubble */}
      <motion.path 
        d="M35 40 Q35 35 40 35 L75 35 Q80 35 80 40 L80 55 Q80 60 75 60 L50 60 L35 70 Z" 
        fill="rgba(255,255,255,0.9)" 
        stroke="rgba(255,153,51,0.3)" 
        strokeWidth="1.5"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      
      {/* Typing indicators */}
      <motion.circle cx="45" cy="47" r="3" fill="#FF9933"
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
      />
      <motion.circle cx="60" cy="47" r="3" fill="#FFB366"
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      />
      <motion.circle cx="75" cy="47" r="3" fill="#138808"
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
      />
      
      {/* Language indicators */}
      <text x="30" y="28" fontSize="10" fill="#FF9933" fontWeight="600">हि</text>
      <text x="80" y="28" fontSize="10" fill="#138808" fontWeight="600">EN</text>
      
      <defs>
        <linearGradient id="chatBubble" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#F0FDF4"/>
        </linearGradient>
        <linearGradient id="chatBorder">
          <stop offset="0%" stopColor="#FF9933"/>
          <stop offset="100%" stopColor="#138808"/>
        </linearGradient>
        <filter id="chatShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.1"/>
        </filter>
      </defs>
    </svg>
  </motion.div>
)

// Modern Microphone Icon
export const ModernMic = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.05, y: -2 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Microphone body */}
      <motion.rect 
        x="50" y="30" width="20" height="40" rx="10" 
        fill="url(#micBody)" 
        stroke="url(#micBorder)" 
        strokeWidth="2"
        filter="url(#micShadow)"
        whileHover={{ scale: 1.05 }}
      />
      
      {/* Stand */}
      <rect x="57" y="70" width="6" height="20" fill="url(#standGradient)" rx="3"/>
      <rect x="45" y="88" width="30" height="6" fill="url(#standGradient)" rx="3"/>
      
      {/* Sound waves */}
      <motion.path 
        d="M25 50 Q20 55 20 60 Q20 65 25 70" 
        stroke="#FF9933" 
        strokeWidth="3" 
        fill="none"
        strokeLinecap="round"
        animate={{ opacity: [0.4, 1, 0.4], strokeWidth: [2, 4, 2] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.path 
        d="M95 50 Q100 55 100 60 Q100 65 95 70" 
        stroke="#FF9933" 
        strokeWidth="3" 
        fill="none"
        strokeLinecap="round"
        animate={{ opacity: [0.4, 1, 0.4], strokeWidth: [2, 4, 2] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      />
      <motion.path 
        d="M30 45 Q22 52 22 60 Q22 68 30 75" 
        stroke="#138808" 
        strokeWidth="2.5" 
        fill="none"
        strokeLinecap="round"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.path 
        d="M90 45 Q98 52 98 60 Q98 68 90 75" 
        stroke="#138808" 
        strokeWidth="2.5" 
        fill="none"
        strokeLinecap="round"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
      />
      
      {/* Grille */}
      <line x1="52" y1="35" x2="68" y2="35" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
      <line x1="52" y1="40" x2="68" y2="40" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
      <line x1="52" y1="45" x2="68" y2="45" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
      <line x1="52" y1="50" x2="68" y2="50" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
      <line x1="52" y1="55" x2="68" y2="55" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
      
      {/* Recording indicator */}
      <motion.circle cx="60" cy="20" r="4" fill="#FF4444"
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      <defs>
        <linearGradient id="micBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F1F5F9"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#E2E8F0"/>
        </linearGradient>
        <linearGradient id="micBorder">
          <stop offset="0%" stopColor="#1E40AF"/>
          <stop offset="100%" stopColor="#3B82F6"/>
        </linearGradient>
        <linearGradient id="standGradient">
          <stop offset="0%" stopColor="#64748B"/>
          <stop offset="100%" stopColor="#475569"/>
        </linearGradient>
        <filter id="micShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.1"/>
        </filter>
      </defs>
    </svg>
  </motion.div>
)

// Modern Users Icon
export const ModernUsers = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.05, y: -2 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Vendor */}
      <motion.g
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <circle cx="40" cy="40" r="12" fill="url(#vendorGrad)" filter="url(#userShadow)"/>
        <path d="M25 80 Q25 65 40 65 Q55 65 55 80 L55 90 L25 90 Z" fill="url(#vendorBodyGrad)"/>
      </motion.g>
      
      {/* Buyer */}
      <motion.g
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <circle cx="80" cy="40" r="12" fill="url(#buyerGrad)" filter="url(#userShadow)"/>
        <path d="M65 80 Q65 65 80 65 Q95 65 95 80 L95 90 L65 90 Z" fill="url(#buyerBodyGrad)"/>
      </motion.g>
      
      {/* Connection */}
      <motion.line 
        x1="52" y1="70" x2="68" y2="70" 
        stroke="url(#connectionGrad)" 
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      />
      
      {/* Unity symbol */}
      <motion.circle 
        cx="60" cy="70" r="4" 
        fill="#FFD700"
        filter="url(#unityShadow)"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      />
      
      {/* Handshake symbol */}
      <motion.path
        d="M55 25 Q60 20 65 25 Q60 30 55 25"
        fill="#FFD700"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <defs>
        <radialGradient id="vendorGrad">
          <stop offset="0%" stopColor="#FFB366"/>
          <stop offset="100%" stopColor="#FF9933"/>
        </radialGradient>
        <radialGradient id="buyerGrad">
          <stop offset="0%" stopColor="#16A085"/>
          <stop offset="100%" stopColor="#138808"/>
        </radialGradient>
        <linearGradient id="vendorBodyGrad">
          <stop offset="0%" stopColor="#FED7AA"/>
          <stop offset="100%" stopColor="#FDBA74"/>
        </linearGradient>
        <linearGradient id="buyerBodyGrad">
          <stop offset="0%" stopColor="#A7F3D0"/>
          <stop offset="100%" stopColor="#6EE7B7"/>
        </linearGradient>
        <linearGradient id="connectionGrad">
          <stop offset="0%" stopColor="#FF9933"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#138808"/>
        </linearGradient>
        <filter id="userShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.1"/>
        </filter>
        <filter id="unityShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.2"/>
        </filter>
      </defs>
    </svg>
  </motion.div>
)

// Modern Shield Icon
export const ModernShield = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.05, y: -2 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Shield */}
      <motion.path 
        d="M60 15 L25 30 L25 65 Q25 85 60 100 Q95 85 95 65 L95 30 Z" 
        fill="url(#shieldGrad)" 
        stroke="url(#shieldBorder)" 
        strokeWidth="2"
        filter="url(#shieldShadow)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      
      {/* Inner design */}
      <path 
        d="M60 25 L35 35 L35 65 Q35 80 60 90 Q85 80 85 65 L85 35 Z" 
        fill="rgba(255,255,255,0.1)" 
        stroke="rgba(255,255,255,0.2)" 
        strokeWidth="1"
      />
      
      {/* Checkmark */}
      <motion.path 
        d="M45 60 L55 70 L75 45" 
        stroke="#FFD700" 
        strokeWidth="5" 
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      
      {/* Security indicators */}
      <motion.circle cx="40" cy="50" r="2" fill="#FF9933"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle cx="80" cy="50" r="2" fill="#138808"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
      />
      
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6"/>
          <stop offset="50%" stopColor="#1E40AF"/>
          <stop offset="100%" stopColor="#1E3A8A"/>
        </linearGradient>
        <linearGradient id="shieldBorder">
          <stop offset="0%" stopColor="#FF9933"/>
          <stop offset="100%" stopColor="#138808"/>
        </linearGradient>
        <filter id="shieldShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.1"/>
        </filter>
      </defs>
    </svg>
  </motion.div>
)

// Modern Zap Icon
export const ModernZap = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.05, y: -2 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Lightning bolt */}
      <motion.path 
        d="M50 20 L35 55 L55 55 L40 100 L80 65 L60 65 L75 30 Z" 
        fill="url(#lightningGrad)"
        stroke="url(#lightningBorder)" 
        strokeWidth="2"
        filter="url(#lightningShadow)"
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      
      {/* Energy sparks */}
      <motion.circle cx="25" cy="35" r="3" fill="#FFD700"
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0.5, 1.5, 0.5],
          x: [0, 8, 0],
          y: [0, -5, 0]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.circle cx="95" cy="45" r="2.5" fill="#FF9933"
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0.5, 1.3, 0.5],
          x: [0, -6, 0],
          y: [0, 3, 0]
        }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle cx="85" cy="85" r="3" fill="#138808"
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0.5, 1.4, 0.5],
          x: [0, -4, 0],
          y: [0, -8, 0]
        }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 1 }}
      />
      
      {/* Energy rings */}
      <motion.circle cx="60" cy="60" r="25" fill="none" stroke="rgba(255,215,0,0.3)" strokeWidth="2"
        animate={{ r: [20, 35, 20], opacity: [0.6, 0.1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle cx="60" cy="60" r="35" fill="none" stroke="rgba(255,153,51,0.2)" strokeWidth="1.5"
        animate={{ r: [30, 45, 30], opacity: [0.4, 0.05, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
      
      <defs>
        <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFA500"/>
          <stop offset="100%" stopColor="#FF8C00"/>
        </linearGradient>
        <linearGradient id="lightningBorder">
          <stop offset="0%" stopColor="#FFB366"/>
          <stop offset="100%" stopColor="#FF9933"/>
        </linearGradient>
        <filter id="lightningShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.1"/>
        </filter>
      </defs>
    </svg>
  </motion.div>
)