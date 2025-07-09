import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Leaf {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  size: number;
  opacity: number;
}

export function FallingLeaves() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    // Generate random leaves
    const generateLeaves = () => {
      const newLeaves: Leaf[] = [];
      for (let i = 0; i < 15; i++) {
        newLeaves.push({
          id: i,
          x: Math.random() * 100, // Random horizontal position (0-100%)
          delay: Math.random() * 5, // Random delay (0-5s)
          duration: 8 + Math.random() * 4, // Random duration (8-12s)
          rotation: Math.random() * 360, // Random initial rotation
          size: 0.8 + Math.random() * 0.4, // Random size (0.8-1.2)
          opacity: 0.3 + Math.random() * 0.4 // Random opacity (0.3-0.7)
        });
      }
      setLeaves(newLeaves);
    };

    generateLeaves();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute"
          style={{
            left: `${leaf.x}%`,
            top: '-10%',
          }}
          initial={{ y: -100, rotate: leaf.rotation, opacity: 0 }}
          animate={{
            y: window.innerHeight + 100,
            rotate: leaf.rotation + 360,
            opacity: [0, leaf.opacity, leaf.opacity, 0],
            x: [0, Math.sin(leaf.id) * 50, Math.cos(leaf.id) * 30, 0], // Swaying motion
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "linear",
            x: {
              duration: leaf.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }}
        >
          {/* Leaf SVG */}
          <svg
            width={24 * leaf.size}
            height={32 * leaf.size}
            viewBox="0 0 24 32"
            className="drop-shadow-sm"
          >
            {/* Leaf shape with neon green gradient */}
            <defs>
              <linearGradient id={`leafGradient${leaf.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00FFA3" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#00FF7F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#32CD32" stopOpacity="0.7" />
              </linearGradient>
              
              {/* Glow effect */}
              <filter id={`glow${leaf.id}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Main leaf shape */}
            <path
              d="M12 2 C8 2, 4 6, 4 12 C4 18, 8 22, 12 30 C16 22, 20 18, 20 12 C20 6, 16 2, 12 2 Z"
              fill={`url(#leafGradient${leaf.id})`}
              filter={`url(#glow${leaf.id})`}
            />
            
            {/* Leaf vein */}
            <path
              d="M12 2 L12 30"
              stroke="#00FF7F"
              strokeWidth="1"
              opacity="0.6"
            />
            
            {/* Side veins */}
            <path
              d="M12 8 L8 12 M12 12 L16 16 M12 16 L8 20 M12 20 L16 24"
              stroke="#00FF7F"
              strokeWidth="0.5"
              opacity="0.4"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}