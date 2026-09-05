import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import livingRoomHero1 from '../../assets/living_room_hero2.png'; // Nordic Minimalist Living (Cream Sectional)
import livingRoomHero2 from '../../assets/living_room_hero.png';  // Mid-Century Warm (Terracotta Accent)
import livingRoomHero3 from '../../assets/living_room_hero3.png'; // Emerald Velvet & Marble Suite

const slides = [
  {
    id: 'slide-1',
    image: livingRoomHero1,
    alt: 'Urban Furniture Nordic Sectional & Fluted Oak Ensemble',
    title: 'Nordic Minimalist Living',
    tag: 'Collection 01',
  },
  {
    id: 'slide-2',
    image: livingRoomHero2,
    alt: 'Urban Furniture Mid-Century Modern Living Room Ensemble',
    title: 'Mid-Century Atelier',
    tag: 'Collection 02',
  },
  {
    id: 'slide-3',
    image: livingRoomHero3,
    alt: 'Urban Furniture Emerald Velvet & Marble Executive Suite',
    title: 'Emerald & Marble Suite',
    tag: 'Collection 03',
  },
];

/**
 * HeroSlideshow — Ultra-responsive automatic luxury furniture carousel
 * Fully automatic cycling with responsive staging for Mobile, Tablet, and Desktop.
 * Clean editorial design without arrow buttons, with interactive bottom-right pill indicators.
 */
export const HeroSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Preload all slide images on mount for instant zero-lag transitions
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  const paginate = useCallback(
    (newDirection = 1) => {
      setDirection(newDirection);
      setCurrentIndex((prevIndex) => {
        let nextIndex = prevIndex + newDirection;
        if (nextIndex < 0) nextIndex = slides.length - 1;
        if (nextIndex >= slides.length) nextIndex = 0;
        return nextIndex;
      });
    },
    []
  );

  const goToSlide = (index) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Automatic cycling: smoothly advances every 4 seconds continuously
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 4000);
    return () => clearInterval(timer);
  }, [paginate, currentIndex]);

  // Touch swipe handling for mobile & tablet devices
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;
    if (diff > minSwipeDistance) {
      paginate(1); // Swiped left -> next
    } else if (diff < -minSwipeDistance) {
      paginate(-1); // Swiped right -> prev
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Keyboard navigation when focused
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') paginate(-1);
    if (e.key === 'ArrowRight') paginate(1);
  };

  // Motion variants for directional entrance & exit
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
      filter: 'blur(3px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
        filter: { duration: 0.35 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      scale: 0.98,
      filter: 'blur(3px)',
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
        filter: { duration: 0.3 },
      },
    }),
  };

  return (
    <div
      className="relative w-full max-w-xl mx-auto select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Living Room Furniture Ensembles Automatic Slideshow"
    >
      {/* Subtle Ambient Radial Backlight */}
      <div className="absolute inset-0 m-auto w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-radial from-[#E8DEC8]/50 via-[#F0E9D8]/20 to-transparent blur-2xl -z-10 pointer-events-none" />

      {/* Main Furniture Image Viewport with Fixed Multi-Device Height to Prevent Layout Shifts */}
      <div className="relative w-full h-[250px] sm:h-[310px] md:h-[380px] lg:h-[430px] flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slides[currentIndex].id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full flex items-center justify-center p-1 sm:p-2"
          >
            <img
              src={slides[currentIndex].image}
              alt={slides[currentIndex].alt}
              className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500 pointer-events-none"
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Bottom-Right Minimalist Luxury Indicators (Borderless & Stylish) */}
      <div className="flex items-center justify-end pt-3 pr-2 sm:pr-4">
        <div
          className="flex items-center gap-2 sm:gap-2.5 py-1"
          role="tablist"
          aria-label="Slide Indicators"
        >
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to ${slide.title}`}
                aria-selected={isActive}
                role="tab"
                className="relative py-2 px-0.5 flex items-center cursor-pointer group/dot focus:outline-none"
              >
                <div
                  className={`relative overflow-hidden rounded-full transition-all duration-500 ease-out ${
                    isActive
                      ? 'w-8 sm:w-10 h-2 sm:h-2.5 bg-[#2D4A3E] shadow-[0_3px_12px_rgba(45,74,62,0.35)]'
                      : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#2D4A3E]/20 group-hover/dot:bg-[#2D4A3E]/50 group-hover/dot:scale-125'
                  }`}
                >
                  {/* Subtle live champagne progress sweep on active slide */}
                  {isActive && (
                    <motion.div
                      key={`progress-${currentIndex}`}
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
                      className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#E8C547]/50 to-transparent pointer-events-none"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroSlideshow;
