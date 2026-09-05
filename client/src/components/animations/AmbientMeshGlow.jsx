import React from 'react';
import { motion } from 'framer-motion';

/**
 * AmbientMeshGlow — Fellou.ai-style organic atmospheric mesh lighting
 * Soft, glowing color orbs that gently drift and breathe in the background.
 */
export const AmbientMeshGlow = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Orb 1: Forest Emerald */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -35, 25, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-24 left-1/4 w-[480px] h-[480px] rounded-full bg-radial from-[#2D4A3E]/20 via-[#2D4A3E]/5 to-transparent blur-3xl"
      />

      {/* Orb 2: Warm Terracotta */}
      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.18, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-1/3 right-10 w-[420px] h-[420px] rounded-full bg-radial from-[#E86034]/15 via-[#E86034]/4 to-transparent blur-3xl"
      />

      {/* Orb 3: Honey Gold / Ochre */}
      <motion.div
        animate={{
          x: [0, 30, -40, 0],
          y: [0, -20, 35, 0],
          scale: [0.95, 1.1, 1, 0.95],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
        className="absolute -bottom-20 left-10 w-[520px] h-[520px] rounded-full bg-radial from-[#E8C547]/12 via-[#E8C547]/3 to-transparent blur-3xl"
      />
    </div>
  );
};

export default AmbientMeshGlow;
