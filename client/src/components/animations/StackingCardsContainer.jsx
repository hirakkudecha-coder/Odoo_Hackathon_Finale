import React from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronRight, Layers } from 'lucide-react';
import { StackingCardItem } from './StackingCardItem';
import { Tilt3DCard } from './Tilt3DCard';

// Image Assets
import orangeSofa from '../../assets/images/orange_sofa.png';
import creamLoungeChair from '../../assets/images/cream_lounge_chair.png';
import botanicalPlant from '../../assets/images/botanical_plant.png';
import oakCredenza from '../../assets/images/oak_credenza.png';

/**
 * StackingCardsContainer — Scroll-driven stacking cards deck
 * Powered by Framer Motion.
 */
export const StackingCardsContainer = () => {
  const cards = [
    {
      id: 'card-1',
      eyebrow: 'Crafting Comfort',
      tag: 'Double-Entry Native',
      title: 'One Ledger at a Time.',
      description:
        'Architectural comfort engineered for modern retail and wholesale operations. Every sale order, customer invoice, and payment automatically generates balanced double-entry accounting records in real time.',
      subText: 'Aesthetic balance for retail & wholesale',
      ctaText: 'View Sales Workflow →',
      ctaLink: '#sales',
      image: orangeSofa,
      imageAlt: 'Luxury Modern Orange Living Room Sofa',
      accentColor: '#E86034',
      bgClass: 'bg-gradient-to-br from-[#FAF5ED] to-[#F1E8DC] border border-[#E6DEC8]',
      textDark: true,
      floatingBadge: {
        title: 'Inventory Value',
        value: '₹4,28,500',
        change: '+14% MoM',
      },
      hasPlayBtn: true,
    },
    {
      id: 'card-2',
      eyebrow: 'Executive Series',
      tag: 'Automated Reconciliation',
      title: 'Harmonized Inventory & Accounts.',
      description:
        'Create an elegant operating space with unified sales orders, customer invoices, and automated debit/credit balancing. Eliminate manual spreadsheets with instant ledger synchronization.',
      subText: 'Zero manual ledger entry • Instant invoice creation',
      ctaText: 'Explore Collection & Ledger →',
      ctaLink: '#accounting',
      image: creamLoungeChair,
      imageAlt: 'Minimal Executive Lounge Chair',
      accentColor: '#2D4A3E',
      bgClass: 'bg-gradient-to-br from-[#FFFFFF] to-[#F7F4EC] border border-[#E6E0D6]',
      textDark: true,
      floatingBadge: {
        title: 'Debtors & Creditors',
        value: '100% Balanced',
        change: 'Zero variance',
      },
      hasPlayBtn: false,
    },
    {
      id: 'card-3',
      eyebrow: 'Organic Harmony',
      tag: 'Cash Flow Engine',
      title: 'Aesthetic Minimalism is Timeless.',
      description:
        'Balanced Books • Effortless Flow. From supplier purchase orders to settled vendor bills, track goods receipts and cash movements without friction. Your financial ledger breathes in harmony with warehouse stock.',
      subText: '40% Gross Margin • 0.001 Floating Point Precision',
      ctaText: 'Explore Purchases Workflow →',
      ctaLink: '#purchases',
      image: botanicalPlant,
      imageAlt: 'Botanical Plant & Minimal Aesthetic',
      accentColor: '#3A5C22',
      bgClass: 'bg-gradient-to-br from-[#F4F9EA] to-[#E8F2DA] border border-[#CCE0B2]',
      textDark: true,
      floatingBadge: {
        title: 'Profit Margin',
        value: '₹5,000 Net',
        change: 'Automated P&L',
      },
      hasPlayBtn: false,
    },
    {
      id: 'card-4',
      eyebrow: 'Financial Intelligence',
      tag: 'Audit-Ready Reporting',
      title: 'Instant Control Over Every Journal Posting.',
      description:
        'Automated journal entries for every furniture sale, vendor purchase, and cash movement. Experience dynamic Balance Sheets and Profit & Loss statements that balance to the exact rupee.',
      subText: 'Assets == Liabilities + Equity: Verified 100%',
      ctaText: 'View Executive Reports →',
      ctaLink: '#reports',
      image: oakCredenza,
      imageAlt: 'Luxury Oak Credenza & Executive Ledger',
      accentColor: '#E8C547',
      bgClass: 'bg-gradient-to-br from-[#1E332A] to-[#13231B] border border-[#2D4A3E] text-white',
      textDark: false,
      floatingBadge: {
        title: 'Balance Sheet',
        value: 'Balanced: true',
        change: '0.000 variance',
      },
      hasPlayBtn: false,
    },
  ];

  return (
    <div className="w-full mt-6 sm:mt-10 lg:mt-12 mb-0">
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-[#2D4A3E]/10">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#2D4A3E] mb-1">
            <Layers className="w-3.5 h-3.5 text-[#E86034]" />
            <span>Curated Operating Spaces • Stacking Deck</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#141A17] tracking-tight">
            Crafting Comfort. <span className="italic font-normal">Layer by Layer.</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#55635D] max-w-sm mt-2 sm:mt-0 font-normal">
          Scroll down to experience our stacked operating cards — synchronizing design, inventory, and accounting ledger.
        </p>
      </div>

      {/* Stacking Cards List — Exact CSS grid-rows & sticky structure */}
      <ul id="cards-deck" className="w-full">
        {cards.map((card, index) => (
          <StackingCardItem
            key={card.id}
            index={index}
            totalCards={cards.length}
          >
            <Tilt3DCard maxTilt={5} glare={true} perspective={1100} className="h-full">
              <div
                className={`relative rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-[0_-4px_25px_rgba(0,0,0,0.06),0_25px_50px_-12px_rgba(0,0,0,0.22)] overflow-hidden preserve-3d transition-colors duration-300 h-full flex flex-col justify-center ${card.bgClass}`}
              >
                <div className="grid grid-cols-12 gap-2 sm:gap-4 lg:gap-8 items-center w-full">
                  
                  {/* Left Column: Editorial Information (col-span-7 on mobile & tablet, col-span-7/6 on desktop) */}
                  <div className="col-span-7 sm:col-span-7 lg:col-span-6 space-y-1 sm:space-y-2 lg:space-y-2.5">
                    {/* Header Row: Eyebrow + Tag */}
                    <div className="flex items-center justify-between gap-1 sm:gap-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        {card.hasPlayBtn && (
                          <motion.div
                            style={{ transform: 'translateZ(30px)' }}
                            whileHover={{ scale: 1.15, rotate: 6 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-[#E86034] text-white flex items-center justify-center shadow-md cursor-pointer shrink-0"
                          >
                            <Play className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 fill-current ml-0.5" />
                          </motion.div>
                        )}
                        <span
                          className={`text-[7.5px] xs:text-[8.5px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-wider truncate ${
                            card.textDark ? 'text-[#2D4A3E]' : 'text-[#E8C547]'
                          }`}
                        >
                          {card.eyebrow}
                        </span>
                      </div>

                      <span
                        style={{ transform: 'translateZ(25px)' }}
                        className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 rounded-full text-[6.5px] xs:text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-semibold uppercase tracking-wider border shadow-xs shrink-0 ${
                          card.textDark
                            ? 'bg-white/85 backdrop-blur-xs text-[#2D4A3E] border-[#2D4A3E]/15'
                            : 'bg-white/10 backdrop-blur-xs text-[#E8C547] border-[#E8C547]/30'
                        }`}
                      >
                        {card.tag}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3
                      className={`font-serif-luxury text-[13px] xs:text-sm sm:text-base md:text-xl lg:text-2xl leading-snug font-bold ${
                        card.textDark ? 'text-[#141A17]' : 'text-[#FAF8F5]'
                      }`}
                    >
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-[9.5px] xs:text-[10.5px] sm:text-xs md:text-[13px] lg:text-sm line-clamp-2 lg:line-clamp-3 leading-snug sm:leading-relaxed ${
                        card.textDark ? 'text-[#4A5550]' : 'text-[#D2DDD6]'
                      }`}
                    >
                      {card.description}
                    </p>

                    {/* Bottom Metadata & Link */}
                    <div
                      className={`flex items-center justify-between pt-1 sm:pt-2 border-t gap-1.5 sm:gap-2 ${
                        card.textDark ? 'border-[#2D4A3E]/10' : 'border-white/15'
                      }`}
                    >
                      <span
                        className={`text-[7.5px] xs:text-[8.5px] sm:text-[10px] md:text-xs italic font-serif truncate max-w-[50%] sm:max-w-none ${
                          card.textDark ? 'text-[#55635D]' : 'text-[#A0B5AA]'
                        }`}
                      >
                        {card.subText}
                      </span>
                      <a
                        href={card.ctaLink}
                        className={`inline-flex items-center gap-0.5 sm:gap-1 text-[7.5px] xs:text-[8.5px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors shrink-0 group ${
                          card.textDark
                            ? 'text-[#2D4A3E] hover:text-[#E86034]'
                            : 'text-[#E8C547] hover:text-white'
                        }`}
                      >
                        <span>{card.ctaText}</span>
                        <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Hero Furniture Photography with 3D Depth & Floating Badge */}
                  <div className="col-span-5 sm:col-span-5 lg:col-span-6 flex items-center justify-center relative py-0.5 sm:py-1">
                    <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-xl flex items-center justify-center min-h-30 sm:min-h-42.5 md:min-h-55 lg:min-h-67.5">
                      
                      {/* Subtle pedestal stage glow for Card 2 (white chair) to provide contrast and grounding */}
                      {card.id === 'card-2' && (
                        <div className="absolute inset-0 m-auto w-32 h-32 sm:w-46 sm:h-46 md:w-60 md:h-60 lg:w-72 lg:h-72 rounded-full bg-radial from-[#E8DEC8]/60 via-[#F0E9D8]/30 to-transparent blur-md -z-10 pointer-events-none" />
                      )}

                      <img
                        src={card.image}
                        alt={card.imageAlt}
                        className={`${
                          card.id === 'card-2'
                            ? 'h-28 xs:h-34 sm:h-46 md:h-58 lg:h-68 w-auto scale-105 sm:scale-110 md:scale-115'
                            : 'w-full max-h-28 xs:max-h-34 sm:max-h-46 md:max-h-58 lg:max-h-68'
                        } object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] sm:drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)] hover:scale-[1.03] transition-transform duration-500`}
                      />

                      {/* Floating Live Metric Tag */}
                      {card.floatingBadge && (
                        <motion.div
                          style={{ transform: 'translateZ(45px)' }}
                          animate={{ y: [0, -2, 0] }}
                          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                          className={`absolute bottom-0 left-0 sm:bottom-1 sm:left-1 md:bottom-1.5 md:left-1.5 backdrop-blur-md px-1.5 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 rounded-md sm:rounded-lg md:rounded-xl shadow-md border flex items-center gap-1 sm:gap-1.5 md:gap-2 z-20 ${
                            card.textDark
                              ? 'bg-[#FAF8F5]/95 border-[#2D4A3E]/10'
                              : 'bg-[#182C24]/95 border-white/20 text-white'
                          }`}
                        >
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                          <div className="text-left leading-tight">
                            <p
                              className={`text-[5.5px] xs:text-[6.5px] sm:text-[7.5px] md:text-[8.5px] font-semibold uppercase tracking-wider ${
                                card.textDark ? 'text-[#66726D]' : 'text-[#A6B9B0]'
                              }`}
                            >
                              {card.floatingBadge.title}
                            </p>
                            <p
                              className={`text-[7px] xs:text-[8px] sm:text-[9.5px] md:text-[11px] font-bold ${
                                card.textDark ? 'text-[#141A17]' : 'text-white'
                              }`}
                            >
                              {card.floatingBadge.value}{' '}
                              <span
                                className={`text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] font-normal font-sans ${
                                  card.textDark ? 'text-emerald-600' : 'text-emerald-400'
                                }`}
                              >
                                {card.floatingBadge.change}
                              </span>
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </Tilt3DCard>
          </StackingCardItem>
        ))}
      </ul>
    </div>
  );
};

export default StackingCardsContainer;
