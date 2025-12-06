import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NeonCityBackgroundProps {
  colorScheme?: 'cyan' | 'magenta' | 'green' | 'yellow' | 'purple' | 'orange' | 'mixed';
  intensity?: 'subtle' | 'medium' | 'intense';
}

const colorSchemes = {
  cyan: {
    primary: '#00FFFF',
    secondary: '#0099FF',
    accent: '#00FF88',
    glow: 'rgba(0, 255, 255, 0.3)',
  },
  magenta: {
    primary: '#FF00FF',
    secondary: '#FF0099',
    accent: '#FF00FF',
    glow: 'rgba(255, 0, 255, 0.3)',
  },
  green: {
    primary: '#00FF00',
    secondary: '#00FF88',
    accent: '#00FFFF',
    glow: 'rgba(0, 255, 0, 0.3)',
  },
  yellow: {
    primary: '#FFFF00',
    secondary: '#FFD700',
    accent: '#FF8800',
    glow: 'rgba(255, 255, 0, 0.3)',
  },
  purple: {
    primary: '#BB00FF',
    secondary: '#FF00FF',
    accent: '#00FFFF',
    glow: 'rgba(187, 0, 255, 0.3)',
  },
  orange: {
    primary: '#FF6600',
    secondary: '#FF8800',
    accent: '#FFAA00',
    glow: 'rgba(255, 102, 0, 0.3)',
  },
  mixed: {
    primary: '#00FFFF',
    secondary: '#FF00FF',
    accent: '#FFFF00',
    glow: 'rgba(0, 255, 255, 0.2)',
  },
};

const intensityLevels = {
  subtle: 0.3,
  medium: 0.6,
  intense: 1,
};

export const NeonCityBackground: React.FC<NeonCityBackgroundProps> = ({
  colorScheme = 'cyan',
  intensity = 'medium',
}) => {
  const colors = colorSchemes[colorScheme];
  const opacityMultiplier = intensityLevels[intensity];

  const [buildings, setBuildings] = useState<Array<{ id: number; height: number; x: number }>>([]);

  useEffect(() => {
    // Generate random buildings
    const newBuildings = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      height: Math.random() * 60 + 40,
      x: (i / 12) * 100,
    }));
    setBuildings(newBuildings);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black">
      {/* Main gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, 
            rgba(0, 0, 0, 1) 0%, 
            rgba(20, 0, 40, ${0.8 * opacityMultiplier}) 50%, 
            rgba(0, 0, 0, 1) 100%)`,
        }}
      />

      {/* Animated grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" style={{ opacity: 0.15 * opacityMultiplier }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke={colors.primary}
              strokeWidth="0.5"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Animated grid perspective */}
      <motion.div
        className="absolute inset-0"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 * opacityMultiplier }}>
          <line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke={colors.primary}
            strokeWidth="1"
            opacity="0.3"
          />
          <line
            x1="50%"
            y1="0"
            x2="50%"
            y2="100%"
            stroke={colors.secondary}
            strokeWidth="1"
            opacity="0.3"
          />
        </svg>
      </motion.div>

      {/* Animated buildings */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 flex items-flex-end justify-between px-4">
        {buildings.map((building) => (
          <motion.div
            key={building.id}
            className="relative"
            style={{
              width: `${100 / buildings.length}%`,
              height: `${building.height}%`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div
              className="w-full h-full relative"
              style={{
                background: `linear-gradient(180deg, 
                  ${colors.primary}20 0%, 
                  ${colors.secondary}10 100%)`,
                borderLeft: `2px solid ${colors.primary}`,
                borderRight: `2px solid ${colors.secondary}`,
                boxShadow: `0 0 20px ${colors.glow}, inset 0 0 20px ${colors.glow}`,
              }}
            >
              {/* Windows */}
              {Array.from({ length: Math.floor(building.height / 10) }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${10 + i * 12}%`,
                    background: colors.primary,
                    boxShadow: `0 0 10px ${colors.primary}`,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: colors.primary,
            boxShadow: `0 0 10px ${colors.primary}`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Glow orbs */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            width: '200px',
            height: '200px',
            left: `${20 + i * 30}%`,
            top: `${20 + i * 20}%`,
            background: colors.glow,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Scan lines effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          )`,
          animation: `scan 8s linear infinite`,
          opacity: 0.1 * opacityMultiplier,
        }}
      />

      <style>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(10px);
          }
        }
      `}</style>
    </div>
  );
};

export default NeonCityBackground;
