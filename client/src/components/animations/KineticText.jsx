import React from 'react';
import { motion } from 'framer-motion';

/**
 * KineticText — Staggered character animation with kinetic spring entrance
 * Powered by Framer Motion.
 */
export const KineticText = ({
  text = '',
  delay = 0,
  delayOffset = 0,
  className = '',
}) => {
  const letters = Array.from(text || '');
  const activeDelay = delayOffset || delay || 0;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.024,
        delayChildren: activeDelay,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -45,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 14,
        stiffness: 140,
        mass: 0.5,
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`inline-block whitespace-pre-wrap ${className}`}
      style={{ perspective: 600 }}
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default KineticText;
