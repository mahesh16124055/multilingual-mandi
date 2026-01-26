import { motion } from 'framer-motion'

export default function FlowingFlag({ size = 60, className = '', animate = true, chakraPosition = 'center' }) {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      {/* Flowing Saffron Stripe - Extends beyond boundaries */}
      <motion.div
        className="absolute -inset-x-20 top-0 h-1/3 overflow-visible"
        style={{
          background: 'linear-gradient(135deg, #FF9933 0%, #FF8C00 30%, #FFB366 60%, #FF9933 100%)',
          clipPath: 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)',
          transform: 'perspective(800px) rotateX(5deg)',
          filter: 'drop-shadow(0 4px 8px rgba(255, 153, 51, 0.3))'
        }}
        animate={animate ? {
          clipPath: [
            'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)',
            'polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)',
            'polygon(0% 0%, 100% 0%, 92% 100%, 8% 100%)',
            'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)'
          ],
          transform: [
            'perspective(800px) rotateX(5deg) translateZ(0px)',
            'perspective(800px) rotateX(3deg) translateZ(2px)',
            'perspective(800px) rotateX(7deg) translateZ(-1px)',
            'perspective(800px) rotateX(5deg) translateZ(0px)'
          ]
        } : {}}
        transition={animate ? {
          duration: 4,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1]
        } : {}}
      >
        {/* Flowing texture overlay */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 50%, rgba(255,215,0,0.3) 0%, transparent 50%)
            `
          }}
          animate={animate ? {
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          } : {}}
          transition={animate ? {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        />
      </motion.div>

      {/* Flowing White Stripe - Clean and minimal */}
      <motion.div
        className="absolute -inset-x-16 top-1/3 h-1/3 overflow-visible"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 50%, #FFFFFF 100%)',
          clipPath: 'polygon(2% 0%, 98% 0%, 96% 100%, 4% 100%)',
          transform: 'perspective(800px) rotateX(-2deg)',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
        }}
        animate={animate ? {
          clipPath: [
            'polygon(2% 0%, 98% 0%, 96% 100%, 4% 100%)',
            'polygon(5% 0%, 95% 0%, 93% 100%, 7% 100%)',
            'polygon(1% 0%, 99% 0%, 97% 100%, 3% 100%)',
            'polygon(2% 0%, 98% 0%, 96% 100%, 4% 100%)'
          ],
          transform: [
            'perspective(800px) rotateX(-2deg) translateZ(0px)',
            'perspective(800px) rotateX(-1deg) translateZ(1px)',
            'perspective(800px) rotateX(-3deg) translateZ(-0.5px)',
            'perspective(800px) rotateX(-2deg) translateZ(0px)'
          ]
        } : {}}
        transition={animate ? {
          duration: 3.5,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
          delay: 0.8
        } : {}}
      />

      {/* Flowing Green Stripe - Extends beyond boundaries */}
      <motion.div
        className="absolute -inset-x-20 bottom-0 h-1/3 overflow-visible"
        style={{
          background: 'linear-gradient(135deg, #138808 0%, #228B22 30%, #16A085 60%, #138808 100%)',
          clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
          transform: 'perspective(800px) rotateX(-5deg)',
          filter: 'drop-shadow(0 4px 8px rgba(19, 136, 8, 0.3))'
        }}
        animate={animate ? {
          clipPath: [
            'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
            'polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)',
            'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)',
            'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)'
          ],
          transform: [
            'perspective(800px) rotateX(-5deg) translateZ(0px)',
            'perspective(800px) rotateX(-3deg) translateZ(2px)',
            'perspective(800px) rotateX(-7deg) translateZ(-1px)',
            'perspective(800px) rotateX(-5deg) translateZ(0px)'
          ]
        } : {}}
        transition={animate ? {
          duration: 3.8,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
          delay: 1.5
        } : {}}
      >
        {/* Flowing texture overlay */}
        <motion.div
          className="absolute inset-0 opacity-15"
          style={{
            background: `
              radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 50%, rgba(0,100,0,0.2) 0%, transparent 50%)
            `
          }}
          animate={animate ? {
            backgroundPosition: ['100% 50%', '0% 50%', '100% 50%']
          } : {}}
          transition={animate ? {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        />
      </motion.div>

      {/* Ashoka Chakra - Positioned uniquely based on prop */}
      <div 
        className="absolute z-20"
        style={{
          top: chakraPosition === 'top' ? '10%' : 
               chakraPosition === 'bottom' ? '70%' : '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <motion.div
          animate={animate ? { rotate: 360 } : {}}
          transition={animate ? { 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          } : {}}
          style={{ 
            width: size * 0.35, 
            height: size * 0.35,
            filter: 'drop-shadow(0 0 15px rgba(30, 64, 175, 0.6))'
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer glow ring */}
            <circle
              cx="50"
              cy="50"
              r="48"
              stroke="url(#chakraOuterGlow)"
              strokeWidth="3"
              fill="none"
              filter="url(#glowEffect)"
            />
            
            {/* Inner ring */}
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="url(#chakraInnerGlow)"
              strokeWidth="2.5"
              fill="none"
            />
            
            {/* Center hub */}
            <circle
              cx="50"
              cy="50"
              r="8"
              fill="url(#chakraCenterGradient)"
              filter="url(#centerGlow)"
            />
            
            {/* 24 spokes with enhanced design */}
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
                  filter="url(#spokeGlow)"
                />
              )
            })}
            
            {/* Decorative elements */}
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
                  r="2.5"
                  fill="url(#dotGradient)"
                  filter="url(#dotGlow)"
                  animate={{
                    r: [2, 3, 2],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: "easeInOut"
                  }}
                />
              )
            })}

            <defs>
              {/* Enhanced filters */}
              <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              <filter id="centerGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              <filter id="spokeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#1e40af" floodOpacity="0.6"/>
              </filter>
              
              <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Enhanced gradients */}
              <linearGradient id="chakraOuterGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
              
              <linearGradient id="chakraInnerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
              
              <radialGradient id="chakraCenterGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </radialGradient>
              
              <linearGradient id="spokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
              
              <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Patriotic energy particles */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: i % 3 === 0 ? '#FF9933' : i % 3 === 1 ? '#FFFFFF' : '#138808',
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: [0, (Math.random() - 0.5) * 20],
            y: [0, (Math.random() - 0.5) * 20]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}