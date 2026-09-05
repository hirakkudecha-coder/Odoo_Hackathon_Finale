import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Tilt3DCard — Fellou.ai-style 3D perspective mouse tilt with specular lighting
 * and spatial Z-depth planes for child elements.
 */
export const Tilt3DCard = ({
  children,
  className = '',
  maxTilt = 8,
  glare = true,
  perspective = 1000,
  onClick,
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized mouse coordinates: -0.5 to +0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Percentage for glare effect: 0% to 100%
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Smooth springs to eliminate jitter
  const springConfig = { stiffness: 220, damping: 20, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D Rotations
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(xPos);
    mouseY.set(yPos);

    if (glare) {
      glareX.set(((e.clientX - rect.left) / rect.width) * 100);
      glareY.set(((e.clientY - rect.top) / rect.height) * 100);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className="w-full h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.015 }}
        transition={{ scale: { duration: 0.3 } }}
        className={`relative w-full h-full ${className}`}
      >
        {children}

        {/* Dynamic Specular Glare Reflection */}
        {glare && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden z-30"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(circle 350px at ${glareX.get()}% ${glareY.get()}%, rgba(255, 255, 255, 0.16) 0%, transparent 80%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Tilt3DCard;
