import { motion } from 'framer-motion'

export default function IndianFlag({ size = 60, className = '', animate = true }) {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      {/* Flag Container with 3D perspective */}
      <div 
        className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl"
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Saffron Stripe */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1/3"
          style={{ 
            background: 'linear-gradient(135deg, #FF9933 0%, #FF8C00 50%, #FF9933 100%)',
            transformOrigin: 'left center'
          }}
          animate={animate ? {
            rotateY: [0, 3, -2, 1, 0],
            scaleX: [1, 1.02, 0.98, 1.01, 1]
          } : {}}
          transition={animate ? {
            duration: 4,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1]
          } : {}}
        >
          {/* Cloth texture overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 1px, transparent 2px),
                radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 1px, transparent 2px)
              `,
              backgroundSize: '6px 6px, 4px 4px'
            }}
          />
        </motion.div>
        
        {/* White Stripe */}
        <motion.div 
          className="absolute top-1/3 left-0 right-0 h-1/3"
          style={{ 
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 50%, #FFFFFF 100%)',
            transformOrigin: 'left center'
          }}
          animate={animate ? {
            rotateY: [0, -2, 3, -1, 0],
            scaleX: [1, 0.99, 1.01, 0.995, 1]
          } : {}}
          transition={animate ? {
            duration: 3.5,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: 0.7
          } : {}}
        >
          {/* Subtle shadow for depth */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: 'linear-gradient(90deg, rgba(0,0,0,0.05) 0%, transparent 50%, rgba(0,0,0,0.03) 100%)'
            }}
          />
        </motion.div>
        
        {/* Green Stripe */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1/3"
          style={{ 
            background: 'linear-gradient(135deg, #138808 0%, #228B22 50%, #138808 100%)',
            transformOrigin: 'left center'
          }}
          animate={animate ? {
            rotateY: [0, 2, -3, 1.5, 0],
            scaleX: [1, 1.01, 0.97, 1.005, 1]
          } : {}}
          transition={animate ? {
            duration: 3.8,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: 1.2
          } : {}}
        >
          {/* Cloth texture overlay */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 1px, transparent 2px),
                radial-gradient(circle at 70% 70%, rgba(0,0,0,0.1) 1px, transparent 2px)
              `,
              backgroundSize: '5px 5px, 3px 3px'
            }}
          />
        </motion.div>

        {/* Ashoka Chakra in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={animate ? { rotate: 360 } : {}}
            transition={animate ? { duration: 20, repeat: Infinity, ease: "linear" } : {}}
            style={{ width: size * 0.25, height: size * 0.25 }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
            >
              {/* Outer circle */}
              <circle
                cx="50"
                cy="50"
                r="48"
                stroke="#1e40af"
                strokeWidth="3"
                fill="none"
              />
              
              {/* Inner circle */}
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="#1e40af"
                strokeWidth="2"
                fill="none"
              />
              
              {/* Center circle */}
              <circle
                cx="50"
                cy="50"
                r="6"
                fill="#1e40af"
              />
              
              {/* 24 spokes */}
              {Array.from({ length: 24 }, (_, i) => {
                const angle = (i * 360) / 24
                const radian = (angle * Math.PI) / 180
                const x1 = 50 + 10 * Math.cos(radian)
                const y1 = 50 + 10 * Math.sin(radian)
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
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )
              })}
            </svg>
          </motion.div>
        </div>

        {/* Flag pole edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.1), transparent)'
          }}
        />

        {/* Patriotic glow border */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, #FF9933, transparent, #138808, transparent)',
            padding: '1px',
            opacity: 0.3
          }}
          animate={animate ? {
            rotate: [0, 360],
            opacity: [0.2, 0.4, 0.2]
          } : {}}
          transition={animate ? {
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          } : {}}
        >
          <div className="w-full h-full rounded-lg bg-transparent" />
        </motion.div>
      </div>
    </div>
  )
}