import { motion } from 'framer-motion'

export default function AshokaChakra({ size = 24, className = '', animate = true }) {
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