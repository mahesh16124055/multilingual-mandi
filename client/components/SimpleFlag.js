import { motion } from 'framer-motion'

export default function SimpleFlag({ size = 60, className = '' }) {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      {/* Simple flowing flag design */}
      <div className="relative w-full h-full overflow-visible">
        {/* Saffron stripe - extends beyond */}
        <motion.div
          className="absolute -left-4 -right-4 top-0 h-1/3"
          style={{
            background: 'linear-gradient(90deg, #FF9933, #FFB366, #FF9933)',
            borderRadius: '0 8px 8px 0'
          }}
          animate={{
            x: [0, 2, -1, 0],
            scaleX: [1, 1.02, 0.98, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* White stripe */}
        <div
          className="absolute left-0 right-0 top-1/3 h-1/3 bg-white"
          style={{ borderRadius: '0 4px 4px 0' }}
        />
        
        {/* Green stripe - extends beyond */}
        <motion.div
          className="absolute -left-4 -right-4 bottom-0 h-1/3"
          style={{
            background: 'linear-gradient(90deg, #138808, #16A085, #138808)',
            borderRadius: '0 8px 8px 0'
          }}
          animate={{
            x: [0, -1, 2, 0],
            scaleX: [1, 0.98, 1.02, 1]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Ashoka Chakra in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ width: size * 0.3, height: size * 0.3 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="#1e40af" strokeWidth="3" fill="none"/>
              <circle cx="50" cy="50" r="32" stroke="#1e40af" strokeWidth="2" fill="none"/>
              <circle cx="50" cy="50" r="6" fill="#1e40af"/>
              
              {/* 24 spokes */}
              {Array.from({ length: 24 }, (_, i) => {
                const angle = (i * 360) / 24
                const radian = (angle * Math.PI) / 180
                const x1 = 50 + 10 * Math.cos(radian)
                const y1 = 50 + 10 * Math.sin(radian)
                const x2 = 50 + 32 * Math.cos(radian)
                const y2 = 50 + 32 * Math.sin(radian)
                
                return (
                  <line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#1e40af"
                    strokeWidth="2"
                    strokeLinecap="round"
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