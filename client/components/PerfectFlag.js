import { motion } from 'framer-motion'

export default function PerfectFlag({ size = 60, className = '' }) {
  return (
    <div className={`relative inline-block flag-container ${className}`} style={{ width: size, height: size }}>
      {/* Clean flag container */}
      <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
        {/* Saffron stripe - clean and flowing */}
        <motion.div
          className="absolute -left-4 -right-4 top-0 h-1/3"
          style={{
            background: 'linear-gradient(90deg, #FF9933 0%, #FF8C00 50%, #FF9933 100%)',
            clipPath: 'polygon(0% 0%, 100% 0%, 96% 100%, 4% 100%)'
          }}
          animate={{
            clipPath: [
              'polygon(0% 0%, 100% 0%, 96% 100%, 4% 100%)',
              'polygon(0% 0%, 100% 0%, 94% 100%, 6% 100%)',
              'polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)',
              'polygon(0% 0%, 100% 0%, 96% 100%, 4% 100%)'
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* White stripe - clean center */}
        <div
          className="absolute left-0 right-0 top-1/3 h-1/3 bg-white"
        />
        
        {/* Green stripe - clean and flowing */}
        <motion.div
          className="absolute -left-4 -right-4 bottom-0 h-1/3"
          style={{
            background: 'linear-gradient(90deg, #138808 0%, #228B22 50%, #138808 100%)',
            clipPath: 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)'
          }}
          animate={{
            clipPath: [
              'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)',
              'polygon(6% 0%, 94% 0%, 100% 100%, 0% 100%)',
              'polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)',
              'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)'
            ]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2
          }}
        />
        
        {/* Clean Ashoka Chakra - No unnecessary effects */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ width: size * 0.4, height: size * 0.4 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
              {/* Outer rim */}
              <circle
                cx="50"
                cy="50"
                r="46"
                stroke="#1e40af"
                strokeWidth="2.5"
                fill="none"
              />
              
              {/* Inner rim */}
              <circle
                cx="50"
                cy="50"
                r="36"
                stroke="#1e40af"
                strokeWidth="2"
                fill="none"
              />
              
              {/* Center hub */}
              <circle
                cx="50"
                cy="50"
                r="4.5"
                fill="#1e40af"
              />
              
              {/* 24 spokes - Clean and accurate */}
              {Array.from({ length: 24 }, (_, i) => {
                const angle = (i * 360) / 24
                const radian = (angle * Math.PI) / 180
                
                const x1 = 50 + 7 * Math.cos(radian)
                const y1 = 50 + 7 * Math.sin(radian)
                const x2 = 50 + 36 * Math.cos(radian)
                const y2 = 50 + 36 * Math.sin(radian)
                
                return (
                  <g key={i}>
                    <line
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="#1e40af"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <circle
                      cx={x2} cy={y2}
                      r="1"
                      fill="#1e40af"
                    />
                  </g>
                )
              })}
              
              {/* Small decorative dots */}
              {Array.from({ length: 8 }, (_, i) => {
                const angle = (i * 360) / 8 + 22.5
                const radian = (angle * Math.PI) / 180
                const x = 50 + 26 * Math.cos(radian)
                const y = 50 + 26 * Math.sin(radian)
                
                return (
                  <circle
                    key={i}
                    cx={x} cy={y} r="0.8"
                    fill="#3b82f6"
                  />
                )
              })}
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  )
}