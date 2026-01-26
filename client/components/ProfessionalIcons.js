import { motion } from 'framer-motion'

// Ultra-Professional Globe Icon - Clean, no boxes
export const UltraProfessionalGlobe = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.1, rotate: 5 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Globe with subtle gradient */}
      <motion.circle 
        cx="60" cy="60" r="50" 
        fill="url(#ultraGlobeGradient)" 
        stroke="none"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      
      {/* Continents - India highlighted */}
      <motion.path 
        d="M25 45 Q35 35 50 40 Q60 45 70 35 Q80 40 85 50 Q80 60 75 65 Q65 70 55 65 Q45 60 40 55 Q30 50 25 45Z" 
        fill="rgba(255,153,51,0.4)" 
        stroke="#FF9933" 
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
      
      {/* India subcontinent - special highlight */}
      <motion.path 
        d="M60 50 Q65 45 70 50 Q75 55 70 60 Q65 65 60 60 Q55 55 60 50Z" 
        fill="#FF9933" 
        stroke="#138808" 
        strokeWidth="2"
        animate={{ 
          fill: ["#FF9933", "#FFB366", "#FF9933"],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Meridian lines */}
      <motion.g stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none">
        <circle cx="60" cy="60" r="35" />
        <circle cx="60" cy="60" r="25" />
        <line x1="60" y1="10" x2="60" y2="110" />
        <line x1="10" y1="60" x2="110" y2="60" />
      </motion.g>
      
      {/* Floating connection dots */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.circle
          key={i}
          cx={30 + i * 12}
          cy={30 + Math.sin(i) * 10}
          r="2"
          fill="#FFD700"
          animate={{
            opacity: [0.3, 1, 0.3],
            cy: [30 + Math.sin(i) * 10, 35 + Math.sin(i) * 10, 30 + Math.sin(i) * 10]
          }}
          transition={{
            duration: 2 + i * 0.2,
            repeat: Infinity,
            delay: i * 0.3
          }}
        />
      ))}
      
      <defs>
        <radialGradient id="ultraGlobeGradient" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#60A5FA"/>
          <stop offset="70%" stopColor="#3B82F6"/>
          <stop offset="100%" stopColor="#1E40AF"/>
        </radialGradient>
      </defs>
    </svg>
  </motion.div>
)

// Ultra-Professional Trending Up - Clean growth visualization
export const UltraProfessionalTrendingUp = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.3 }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Background circle - subtle */}
      <circle cx="60" cy="60" r="50" fill="url(#ultraTrendGradient)" opacity="0.1"/>
      
      {/* Growth bars with staggered animation */}
      {[
        { x: 25, height: 20, delay: 0.2 },
        { x: 40, height: 35, delay: 0.4 },
        { x: 55, height: 50, delay: 0.6 },
        { x: 70, height: 65, delay: 0.8 },
        { x: 85, height: 80, delay: 1.0 }
      ].map((bar, i) => (
        <motion.rect
          key={i}
          x={bar.x}
          y={90 - bar.height}
          width="8"
          height={bar.height}
          rx="4"
          fill={`url(#barGradient${i})`}
          initial={{ height: 0, y: 90 }}
          animate={{ height: bar.height, y: 90 - bar.height }}
          transition={{ duration: 1, delay: bar.delay, ease: "easeOut" }}
        />
      ))}
      
      {/* Trend line */}
      <motion.path 
        d="M20 85 L35 70 L50 55 L65 40 L80 25 L95 15" 
        stroke="#FFD700" 
        strokeWidth="3" 
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1.2 }}
      />
      
      {/* Arrow */}
      <motion.path 
        d="M90 10 L100 15 L95 25 Z" 
        fill="#FFD700"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5 }}
      />
      
      {/* Success sparkles */}
      {Array.from({ length: 4 }, (_, i) => (
        <motion.circle
          key={i}
          cx={70 + i * 8}
          cy={20 + i * 3}
          r="1.5"
          fill="#FFD700"
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3
          }}
        />
      ))}
      
      <defs>
        <linearGradient id="ultraTrendGradient">
          <stop offset="0%" stopColor="#10B981"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
        {[0, 1, 2, 3, 4].map(i => (
          <linearGradient key={i} id={`barGradient${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={i < 2 ? "#FF9933" : i < 4 ? "#FFB366" : "#138808"}/>
            <stop offset="100%" stopColor={i < 2 ? "#FF7A00" : i < 4 ? "#FF9933" : "#0F9D58"}/>
          </linearGradient>
        ))}
      </defs>
    </svg>
  </motion.div>
)

// Ultra-Professional Chat - Multilingual conversation
export const UltraProfessionalChat = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.1, rotate: -2 }}
    transition={{ duration: 0.3 }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Main chat bubble */}
      <motion.path 
        d="M20 30 Q20 20 30 20 L80 20 Q90 20 90 30 L90 60 Q90 70 80 70 L40 70 L20 85 Z" 
        fill="url(#ultraChatGradient)" 
        stroke="rgba(255,153,51,0.3)" 
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Secondary bubble */}
      <motion.path 
        d="M35 40 Q35 35 40 35 L75 35 Q80 35 80 40 L80 55 Q80 60 75 60 L50 60 L35 70 Z" 
        fill="rgba(255,255,255,0.9)" 
        stroke="rgba(19,136,8,0.3)" 
        strokeWidth="1.5"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      
      {/* Animated typing dots */}
      {[45, 55, 65].map((x, i) => (
        <motion.circle
          key={i}
          cx={x}
          cy="47"
          r="2.5"
          fill={i === 0 ? "#FF9933" : i === 1 ? "#FFB366" : "#138808"}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
      
      {/* Language indicators */}
      <text x="25" y="28" fontSize="8" fill="#FF9933" fontWeight="bold">हि</text>
      <text x="75" y="28" fontSize="8" fill="#138808" fontWeight="bold">EN</text>
      
      {/* Connection lines */}
      <motion.path
        d="M55 15 Q60 10 65 15"
        stroke="#FFD700"
        strokeWidth="2"
        fill="none"
        animate={{ pathLength: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <defs>
        <linearGradient id="ultraChatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#F0FDF4"/>
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
)

// Ultra-Professional Microphone - Voice waves
export const UltraProfessionalMic = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.3 }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Microphone body */}
      <motion.rect 
        x="50" y="30" width="20" height="40" rx="10" 
        fill="url(#ultraMicGradient)" 
        stroke="#1E40AF" 
        strokeWidth="2"
        whileHover={{ scale: 1.05 }}
      />
      
      {/* Microphone stand */}
      <rect x="57" y="70" width="6" height="20" fill="#64748B" rx="3"/>
      <rect x="45" y="88" width="30" height="6" fill="#64748B" rx="3"/>
      
      {/* Sound waves - animated */}
      {[
        { path: "M25 50 Q20 55 20 60 Q20 65 25 70", delay: 0 },
        { path: "M95 50 Q100 55 100 60 Q100 65 95 70", delay: 0.2 },
        { path: "M30 45 Q22 52 22 60 Q22 68 30 75", delay: 0.4 },
        { path: "M90 45 Q98 52 98 60 Q98 68 90 75", delay: 0.6 }
      ].map((wave, i) => (
        <motion.path
          key={i}
          d={wave.path}
          stroke={i < 2 ? "#FF9933" : "#138808"}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={{ 
            opacity: [0.3, 1, 0.3],
            strokeWidth: [2, 4, 2]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: wave.delay
          }}
        />
      ))}
      
      {/* Microphone grille */}
      {[35, 40, 45, 50, 55].map(y => (
        <line key={y} x1="52" y1={y} x2="68" y2={y} stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
      ))}
      
      {/* Voice indicator */}
      <motion.circle
        cx="60"
        cy="20"
        r="4"
        fill="#FFD700"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1,
          repeat: Infinity
        }}
      />
      
      <defs>
        <linearGradient id="ultraMicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F1F5F9"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#E2E8F0"/>
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
)

// Ultra-Professional Users - Unity representation
export const UltraProfessionalUsers = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.3 }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Vendor figure */}
      <motion.g
        initial={{ x: -15, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <circle cx="40" cy="40" r="12" fill="url(#vendorGradient)"/>
        <path d="M25 75 Q25 60 40 60 Q55 60 55 75 L55 85 L25 85 Z" fill="url(#vendorBodyGradient)"/>
      </motion.g>
      
      {/* Buyer figure */}
      <motion.g
        initial={{ x: 15, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <circle cx="80" cy="40" r="12" fill="url(#buyerGradient)"/>
        <path d="M65 75 Q65 60 80 60 Q95 60 95 75 L95 85 L65 85 Z" fill="url(#buyerBodyGradient)"/>
      </motion.g>
      
      {/* Unity connection */}
      <motion.line 
        x1="52" y1="65" x2="68" y2="65" 
        stroke="url(#unityGradient)" 
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />
      
      {/* Unity symbol */}
      <motion.circle 
        cx="60" cy="65" r="5" 
        fill="#FFD700"
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          delay: 1.5
        }}
      />
      
      {/* Cultural harmony elements */}
      <motion.path
        d="M60 25 Q65 20 70 25 Q65 30 60 25"
        fill="#FFD700"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <defs>
        <radialGradient id="vendorGradient">
          <stop offset="0%" stopColor="#FFB366"/>
          <stop offset="100%" stopColor="#FF9933"/>
        </radialGradient>
        <radialGradient id="buyerGradient">
          <stop offset="0%" stopColor="#16A085"/>
          <stop offset="100%" stopColor="#138808"/>
        </radialGradient>
        <linearGradient id="vendorBodyGradient">
          <stop offset="0%" stopColor="#FED7AA"/>
          <stop offset="100%" stopColor="#FDBA74"/>
        </linearGradient>
        <linearGradient id="buyerBodyGradient">
          <stop offset="0%" stopColor="#A7F3D0"/>
          <stop offset="100%" stopColor="#6EE7B7"/>
        </linearGradient>
        <linearGradient id="unityGradient">
          <stop offset="0%" stopColor="#FF9933"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#138808"/>
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
)

// Ultra-Professional Shield - Security excellence
export const UltraProfessionalShield = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.3 }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Shield shape */}
      <motion.path 
        d="M60 15 L25 30 L25 60 Q25 85 60 100 Q95 85 95 60 L95 30 Z" 
        fill="url(#ultraShieldGradient)" 
        stroke="url(#shieldBorderGradient)" 
        strokeWidth="3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      
      {/* Inner shield design */}
      <path 
        d="M60 25 L35 35 L35 60 Q35 75 60 85 Q85 75 85 60 L85 35 Z" 
        fill="rgba(255,255,255,0.15)" 
        stroke="rgba(255,255,255,0.3)" 
        strokeWidth="1.5"
      />
      
      {/* Security checkmark */}
      <motion.path 
        d="M45 55 L55 65 L75 40" 
        stroke="#FFD700" 
        strokeWidth="5" 
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      />
      
      {/* Security pulse rings */}
      {[30, 40, 50].map((r, i) => (
        <motion.circle
          key={i}
          cx="60"
          cy="57"
          r={r}
          fill="none"
          stroke="rgba(255,215,0,0.3)"
          strokeWidth="1"
          animate={{
            r: [r, r + 10, r],
            opacity: [0.6, 0.1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4
          }}
        />
      ))}
      
      <defs>
        <linearGradient id="ultraShieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6"/>
          <stop offset="50%" stopColor="#1E40AF"/>
          <stop offset="100%" stopColor="#1E3A8A"/>
        </linearGradient>
        <linearGradient id="shieldBorderGradient">
          <stop offset="0%" stopColor="#FF9933"/>
          <stop offset="100%" stopColor="#138808"/>
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
)

// Ultra-Professional Zap - Energy and speed
export const UltraProfessionalZap = ({ size = 32, className = '' }) => (
  <motion.div 
    className={`inline-block ${className}`}
    whileHover={{ scale: 1.1, rotate: 5 }}
    transition={{ duration: 0.3 }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Lightning bolt */}
      <motion.path 
        d="M50 20 L35 55 L55 55 L40 100 L80 65 L60 65 L75 30 Z" 
        fill="url(#ultraLightningGradient)"
        stroke="#FFD700" 
        strokeWidth="2"
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      
      {/* Energy sparks */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.circle
          key={i}
          cx={30 + (i % 4) * 20}
          cy={25 + Math.floor(i / 4) * 70}
          r="2"
          fill={i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FF9933" : "#138808"}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 2, 0.5],
            x: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10],
            y: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10]
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
      
      {/* Energy waves */}
      {[25, 35, 45].map((r, i) => (
        <motion.circle
          key={i}
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="rgba(255,215,0,0.4)"
          strokeWidth="2"
          animate={{
            r: [r, r + 15, r],
            opacity: [0.6, 0.1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3
          }}
        />
      ))}
      
      <defs>
        <linearGradient id="ultraLightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFA500"/>
          <stop offset="100%" stopColor="#FF8C00"/>
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
)