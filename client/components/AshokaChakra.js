import { motion } from 'framer-motion'
import AnimatedFlag from './AnimatedFlag'

export default function AshokaChakra({ size = 24, className = '', animate = true, showFlag = false }) {
  if (showFlag) {
    return (
      <div className={`inline-block relative ${className}`} style={{ width: size, height: size }}>
        {/* Animated Flag Background */}
        <AnimatedFlag size={size} />

        {/* Ashoka Chakra - Animated and Glowing */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          animate={animate ? { 
            rotate: [0, 360],
            scale: [1, 1.05, 1]
          } : {}}
          transition={animate ? { 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          } : {}}
        >
          <svg
            width={size * 0.6}
            height={size * 0.6}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-2xl"
          >
            {/* Outer glow circle */}
            <circle
              cx="50"
              cy="50"
              r="48"
              stroke="url(#outerGlow)"
              strokeWidth="4"
              fill="none"
              filter="url(#glow)"
            />
            
            {/* Inner circle */}
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="url(#innerGlow)"
              strokeWidth="3"
              fill="none"
            />
            
            {/* Center circle with animated gradient */}
            <circle
              cx="50"
              cy="50"
              r="8"
              fill="url(#centerGradient)"
              filter="url(#centerGlow)"
            />
            
            {/* 24 spokes with enhanced styling */}
            {Array.from({ length: 24 }, (_, i) => {
              const angle = (i * 360) / 24
              const radian = (angle * Math.PI) / 180
              const x1 = 50 + 12 * Math.cos(radian)
              const y1 = 50 + 12 * Math.sin(radian)
              const x2 = 50 + 35 * Math.cos(radian)
              const y2 = 50 + 35 * Math.sin(radian)
              
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#spokeGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter="url(#spokeShadow)"
                />
              )
            })}
            
            {/* Decorative elements with pulsing animation */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * 360) / 8
              const radian = (angle * Math.PI) / 180
              const x = 50 + 25 * Math.cos(radian)
              const y = 50 + 25 * Math.sin(radian)
              
              return (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="url(#dotGradient)"
                  filter="url(#dotGlow)"
                  animate={{
                    r: [2.5, 3.5, 2.5],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              )
            })}

            {/* SVG Filters and Gradients */}
            <defs>
              {/* Glow effects */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              <filter id="centerGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              <filter id="spokeShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
              </filter>
              
              <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Gradients */}
              <linearGradient id="outerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
              
              <linearGradient id="innerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
              
              <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#1e40af" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>
              
              <linearGradient id="spokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
              
              <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Additional Sparkle effects around the chakra */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    )
  }

  // Original Ashoka Chakra without flag
  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={animate ? { rotate: 360 } : {}}
      transition={animate ? { duration: 20, repeat: Infinity, ease: "linear" } : {}}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke="#1e40af"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Inner circle */}
        <circle
          cx="50"
          cy="50"
          r="35"
          stroke="#1e40af"
          strokeWidth="1"
          fill="none"
        />
        
        {/* Center circle */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="#1e40af"
        />
        
        {/* 24 spokes */}
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i * 360) / 24
          const radian = (angle * Math.PI) / 180
          const x1 = 50 + 12 * Math.cos(radian)
          const y1 = 50 + 12 * Math.sin(radian)
          const x2 = 50 + 35 * Math.cos(radian)
          const y2 = 50 + 35 * Math.sin(radian)
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#1e40af"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )
        })}
        
        {/* Decorative dots */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 360) / 8
          const radian = (angle * Math.PI) / 180
          const x = 50 + 25 * Math.cos(radian)
          const y = 50 + 25 * Math.sin(radian)
          
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="#f97316"
            />
          )
        })}
      </svg>
    </motion.div>
  )
}