import { motion } from 'framer-motion'

export default function ModernFlag({ size = 60, className = '' }) {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      {/* Modern flag container with depth */}
      <div className="relative w-full h-full rounded-lg overflow-hidden shadow-xl">
        {/* Saffron stripe - extends with wave */}
        <motion.div
          className="absolute -left-3 -right-3 top-0 h-1/3"
          style={{
            background: 'linear-gradient(45deg, #FF9933 0%, #FF8C00 25%, #FFB366 50%, #FF9933 75%, #FF7A00 100%)',
            clipPath: 'polygon(0% 0%, 100% 0%, 97% 100%, 3% 100%)',
            filter: 'drop-shadow(0 2px 4px rgba(255, 153, 51, 0.3))'
          }}
          animate={{
            clipPath: [
              'polygon(0% 0%, 100% 0%, 97% 100%, 3% 100%)',
              'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)',
              'polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)',
              'polygon(0% 0%, 100% 0%, 97% 100%, 3% 100%)'
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
          style={{
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05), inset 0 -2px 4px rgba(0,0,0,0.05)'
          }}
        />
        
        {/* Green stripe - extends with wave */}
        <motion.div
          className="absolute -left-3 -right-3 bottom-0 h-1/3"
          style={{
            background: 'linear-gradient(45deg, #138808 0%, #228B22 25%, #16A085 50%, #138808 75%, #0F7A06 100%)',
            clipPath: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)',
            filter: 'drop-shadow(0 2px 4px rgba(19, 136, 8, 0.3))'
          }}
          animate={{
            clipPath: [
              'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)',
              'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
              'polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)',
              'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)'
            ]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Accurate Ashoka Chakra */}
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
                r="47"
                stroke="#1e40af"
                strokeWidth="2.5"
                fill="none"
                filter="url(#chakraGlow)"
              />
              
              {/* Inner rim */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#1e40af"
                strokeWidth="2"
                fill="none"
              />
              
              {/* Center hub - proper size */}
              <circle
                cx="50"
                cy="50"
                r="5"
                fill="#1e40af"
                filter="url(#centerGlow)"
              />
              
              {/* 24 spokes - accurate Ashoka Chakra design */}
              {Array.from({ length: 24 }, (_, i) => {
                const angle = (i * 360) / 24
                const radian = (angle * Math.PI) / 180
                
                // Inner point (from center hub)
                const x1 = 50 + 8 * Math.cos(radian)
                const y1 = 50 + 8 * Math.sin(radian)
                
                // Outer point (to inner rim)
                const x2 = 50 + 38 * Math.cos(radian)
                const y2 = 50 + 38 * Math.sin(radian)
                
                return (
                  <g key={i}>
                    {/* Main spoke line */}
                    <line
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="#1e40af"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    
                    {/* Spoke tip (small circle at the end) */}
                    <circle
                      cx={x2} cy={y2}
                      r="1.2"
                      fill="#1e40af"
                    />
                  </g>
                )
              })}
              
              {/* Decorative elements between spokes */}
              {Array.from({ length: 12 }, (_, i) => {
                const angle = (i * 360) / 12 + 15 // Offset by 15 degrees
                const radian = (angle * Math.PI) / 180
                const x = 50 + 28 * Math.cos(radian)
                const y = 50 + 28 * Math.sin(radian)
                
                return (
                  <circle
                    key={i}
                    cx={x} cy={y} r="1"
                    fill="#3b82f6"
                    opacity="0.7"
                  />
                )
              })}

              <defs>
                {/* Enhanced filters for better appearance */}
                <filter id="chakraGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                <filter id="centerGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </motion.div>
        </div>
        
        {/* Enhanced border with patriotic glow */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, rgba(255,153,51,0.2), transparent, rgba(19,136,8,0.2))',
            backgroundSize: '200% 200%'
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Subtle inner shadow for depth */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
      </div>
    </div>
  )
}