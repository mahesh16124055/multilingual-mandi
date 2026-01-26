import { motion } from 'framer-motion'

export default function AnimatedFlag({ size = 100, className = '' }) {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      {/* 3D Flag Container */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden shadow-2xl flag-3d-container"
        style={{ 
          width: size, 
          height: size,
          perspective: '800px'
        }}
      >
        {/* Saffron Stripe - Realistic Wave */}
        <motion.div 
          className="absolute top-0 left-0 right-0 flag-stripe"
          style={{ 
            height: `${size / 3}px`,
            background: 'linear-gradient(135deg, #FF9933 0%, #FF7F00 30%, #FF9933 60%, #FF8C00 100%)',
            transformOrigin: 'left center'
          }}
          animate={{
            rotateY: [0, 4, -3, 2, 0],
            rotateX: [0, 2, -1, 1, 0],
            scaleX: [1, 1.03, 0.97, 1.01, 1],
            transform: [
              'rotateY(0deg) rotateX(0deg) scaleX(1)',
              'rotateY(4deg) rotateX(2deg) scaleX(1.03)',
              'rotateY(-3deg) rotateX(-1deg) scaleX(0.97)',
              'rotateY(2deg) rotateX(1deg) scaleX(1.01)',
              'rotateY(0deg) rotateX(0deg) scaleX(1)'
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1]
          }}
        >
          {/* Cloth Shadow Effect */}
          <motion.div
            className="absolute inset-0 cloth-shadow"
            animate={{
              background: [
                'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
                'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.15) 30%, transparent 70%)',
                'linear-gradient(90deg, rgba(0,0,0,0.05) 0%, transparent 40%, rgba(0,0,0,0.1) 100%)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        {/* White Stripe - Realistic Wave */}
        <motion.div 
          className="absolute left-0 right-0 flag-stripe"
          style={{ 
            top: `${size / 3}px`,
            height: `${size / 3}px`,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 30%, #FFFFFF 60%, #FAFAFA 100%)',
            transformOrigin: 'left center'
          }}
          animate={{
            rotateY: [0, -3, 4, -2, 0],
            rotateX: [0, -1, 2, -1, 0],
            scaleX: [1, 0.98, 1.02, 0.99, 1],
            transform: [
              'rotateY(0deg) rotateX(0deg) scaleX(1)',
              'rotateY(-3deg) rotateX(-1deg) scaleX(0.98)',
              'rotateY(4deg) rotateX(2deg) scaleX(1.02)',
              'rotateY(-2deg) rotateX(-1deg) scaleX(0.99)',
              'rotateY(0deg) rotateX(0deg) scaleX(1)'
            ]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: 0.7
          }}
        >
          {/* Subtle Cloth Shadow */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(90deg, rgba(0,0,0,0.03) 0%, transparent 50%, rgba(0,0,0,0.02) 100%)',
                'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.05) 40%, transparent 80%)',
                'linear-gradient(90deg, rgba(0,0,0,0.02) 0%, transparent 60%, rgba(0,0,0,0.03) 100%)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        {/* Green Stripe - Realistic Wave */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 flag-stripe"
          style={{ 
            height: `${size / 3}px`,
            background: 'linear-gradient(135deg, #138808 0%, #228B22 30%, #138808 60%, #32CD32 100%)',
            transformOrigin: 'left center'
          }}
          animate={{
            rotateY: [0, 3, -4, 2, 0],
            rotateX: [0, 1, -2, 1, 0],
            scaleX: [1, 1.02, 0.96, 1.01, 1],
            transform: [
              'rotateY(0deg) rotateX(0deg) scaleX(1)',
              'rotateY(3deg) rotateX(1deg) scaleX(1.02)',
              'rotateY(-4deg) rotateX(-2deg) scaleX(0.96)',
              'rotateY(2deg) rotateX(1deg) scaleX(1.01)',
              'rotateY(0deg) rotateX(0deg) scaleX(1)'
            ]
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: 1.2
          }}
        >
          {/* Cloth Shadow Effect */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, transparent 50%, rgba(0,0,0,0.04) 100%)',
                'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.12) 35%, transparent 75%)',
                'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, transparent 45%, rgba(0,0,0,0.08) 100%)'
              ]
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Realistic Flag Pole Edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.1), transparent)',
            zIndex: 5
          }}
        />

        {/* Wind Flow Lines */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${15 + i * 12}%`,
              left: '25%',
              right: '10%',
              height: '1px',
              background: `rgba(255,255,255,${0.1 + i * 0.02})`,
              transformOrigin: 'left center'
            }}
            animate={{
              scaleX: [0.6, 1.4, 0.8, 1.2, 0.6],
              opacity: [0.2, 0.6, 0.3, 0.5, 0.2],
              rotateZ: [0, 1, -0.5, 0.8, 0]
            }}
            transition={{
              duration: 2.5 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Patriotic Border Glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, #FF9933 0deg, #FFFFFF 120deg, #138808 240deg, #FF9933 360deg)',
          padding: '2px',
          opacity: 0.4
        }}
        animate={{
          rotate: [0, 360],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="w-full h-full rounded-full bg-transparent" />
      </motion.div>
    </div>
  )
}