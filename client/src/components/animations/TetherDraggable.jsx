import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * TetherDraggable — Fellou.ai-style interactive draggable object with elastic tether cord
 * Users can grab and drag the element. An elastic tension line pulls toward its origin and snaps back.
 */
export const TetherDraggable = ({
  children,
  tetherColor = '#E86034',
  maxDrag = 180,
  className = '',
}) => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Smooth springs for snapping back
  const springX = useSpring(dragX, { stiffness: 350, damping: 20 });
  const springY = useSpring(dragY, { stiffness: 350, damping: 20 });

  const [coords, setCoords] = useState({ x: 0, y: 0 });

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {/* SVG Elastic Tether Cord rendered during drag */}
      {isDragging && (
        <svg
          viewBox="-150 -150 300 300"
          className="absolute inset-0 pointer-events-none overflow-visible z-0"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <line
            x1={0}
            y1={0}
            x2={coords.x}
            y2={coords.y}
            stroke={tetherColor}
            strokeWidth="2.5"
            strokeDasharray="4 3"
            strokeLinecap="round"
            opacity={0.75}
          />
        </svg>
      )}

      <motion.span
        drag
        dragConstraints={{ left: -maxDrag, right: maxDrag, top: -maxDrag, bottom: maxDrag }}
        dragElastic={0.4}
        dragSnapToOrigin
        onDragStart={() => setIsDragging(true)}
        onDrag={(e, info) => {
          setCoords({ x: info.offset.x, y: info.offset.y });
          dragX.set(info.offset.x);
          dragY.set(info.offset.y);
        }}
        onDragEnd={() => {
          setIsDragging(false);
          setCoords({ x: 0, y: 0 });
          dragX.set(0);
          dragY.set(0);
        }}
        whileHover={{ scale: 1.1, cursor: 'grab' }}
        whileDrag={{ scale: 1.18, cursor: 'grabbing' }}
        className="relative z-10 select-none inline-flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {children}
      </motion.span>
    </span>
  );
};

export default TetherDraggable;
