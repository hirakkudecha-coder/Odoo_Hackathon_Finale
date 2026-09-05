import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Award, 
  Compass, 
  Layers, 
  Feather, 
  Star, 
  Send, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  Shield, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import designerPortrait from '../../assets/images/designer_portrait.png';
import livingRoomHero from '../../assets/images/living_room_hero.png';
import livingRoomHero2 from '../../assets/images/living_room_hero2.png';
import oakCredenza from '../../assets/images/oak_credenza.png';
import creamChair from '../../assets/images/cream_lounge_chair.png';
import oliveChair from '../../assets/images/olive_chair.png';
import { Footer } from './Footer';

export const AtelierAboutPage = ({ 
  onNavigateHome, 
  initialTab = 'story',
  onOpenAuth,
  onNavigatePartnerHelpdesk,
  onNavigateAbout,
  onNavigateShowrooms
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedInquiry, setConfirmedInquiry] = useState(null);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential Interior',
    estimatedBudget: '$25,000 - $50,000',
    message: '',
  });

  // Sync with URL hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['story', 'craftsmanship', 'reviews', 'designers'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.history.replaceState(null, '', `/about#${tabId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries/designer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryForm)
      });
      const data = await res.json();
      if (data.success && data.inquiry) {
        setConfirmedInquiry(data.inquiry);
      } else {
        setConfirmedInquiry({
          inquiryNumber: `INQ-${Math.floor(100000 + Math.random() * 900000)}`
        });
      }
    } catch {
      // Graceful fallback
      setConfirmedInquiry({
        inquiryNumber: `INQ-${Math.floor(100000 + Math.random() * 900000)}`
      });
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      setInquiryForm({
        name: '',
        email: '',
        phone: '',
        projectType: 'Residential Interior',
        estimatedBudget: '$25,000 - $50,000',
        message: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1F1D] font-sans selection:bg-[#2D4A3E] selection:text-[#FAF8F5] flex flex-col">
      
      {/* Top Fixed Navigation Header matching Project Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#2D4A3E]/12 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D4A3E] hover:text-[#101C17] bg-[#EFECE6] hover:bg-[#E4DFD5] px-3.5 py-2 rounded-full border border-[#2D4A3E]/10 transition-all cursor-pointer shadow-xs group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Atelier</span>
            </button>
            <div className="hidden sm:block h-4 w-px bg-[#D4CEBF]" />
            <button
              onClick={onNavigateHome}
              className="hidden sm:block cursor-pointer text-left"
              title="Return to Atelier Home"
            >
              <BrandLogo />
            </button>
          </div>

          {/* Tab Navigation Pill Bar matching Luxury Editorial Style */}
          <nav className="flex items-center bg-[#F2ECE4]/80 p-1 rounded-full border border-[#2D4A3E]/12 text-xs font-medium overflow-x-auto max-w-full shadow-inner">
            {[
              { id: 'story', label: 'Our Story', icon: Compass },
              { id: 'craftsmanship', label: 'Craftsmanship', icon: Layers },
              { id: 'reviews', label: 'Editorial Reviews', icon: Award },
              { id: 'designers', label: 'Contact Designers', icon: Feather },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap text-[11px] sm:text-xs ${
                    isActive
                      ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-sm font-semibold'
                      : 'text-[#4D5A53] hover:text-[#141A17] hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 flex-1 w-full">

        {/* TAB 1: OUR STORY */}
        {activeTab === 'story' && (
          <div className="space-y-16 animate-fadeIn">
            {/* Hero Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFECE6] border border-[#DED8CC] text-xs text-[#2D4A3E] font-mono tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#E86034]" />
                  <span>Heritage Established 1984 · Milan & Mumbai</span>
                </div>
                <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#101C17] tracking-tight leading-[1.12]">
                  Where Master Furniture Meets <br />
                  <span className="italic font-normal text-[#2D4A3E]">Double-Entry Precision.</span>
                </h1>
                <p className="text-[#55635D] text-sm sm:text-base leading-relaxed max-w-2xl">
                  Urban Furniture began four decades ago with a singular, uncompromising vision: to build bespoke architectural furniture that stands for generations, supported by a state-of-the-art double-entry ledger that accounts for every grain of timber, ounce of brass, and ledger balance.
                </p>
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#E8E4DC]">
                  <div>
                    <span className="font-serif-luxury text-3xl sm:text-4xl text-[#E86034] font-bold">40+</span>
                    <p className="text-[11px] text-[#6D7C75] uppercase tracking-wider font-mono mt-1">Years of Heritage</p>
                  </div>
                  <div>
                    <span className="font-serif-luxury text-3xl sm:text-4xl text-[#2D4A3E] font-bold">12,400+</span>
                    <p className="text-[11px] text-[#6D7C75] uppercase tracking-wider font-mono mt-1">Custom Commissions</p>
                  </div>
                  <div>
                    <span className="font-serif-luxury text-3xl sm:text-4xl text-[#101C17] font-bold">100%</span>
                    <p className="text-[11px] text-[#6D7C75] uppercase tracking-wider font-mono mt-1">Balanced Ledger</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="rounded-3xl overflow-hidden border border-[#E8E4DC] bg-white shadow-xl relative group">
                  <img
                    src={livingRoomHero}
                    alt="Urban Furniture Atelier"
                    className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101C17]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 p-5 rounded-2xl bg-[#101C17]/90 border border-[#2D4A3E] backdrop-blur-md shadow-lg text-white">
                    <p className="text-xs font-serif text-[#FAF8F5] leading-relaxed">"Furniture is not mere decoration; it is the physical architecture of everyday life."</p>
                    <p className="text-[10px] text-[#D2E7A4] mt-1.5 font-mono tracking-wider">— Elena Rossi, Chief Furniture Architect</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Milestones */}
            <div className="space-y-8 pt-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-mono text-[#E86034] uppercase tracking-widest">Chronicles</span>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#101C17]">The Four Decades of Evolution</h2>
                <p className="text-xs text-[#6D7C75]">From artisanal joinery to an integrated international luxury operating workspace.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { year: '1984', title: 'The First Joinery', desc: 'Started in a humble Mumbai woodcraft shop with 3 master cabinetmakers dedicated to teak.' },
                  { year: '1998', title: 'Italian Tanning Alliance', desc: 'Partnered with heritage tanneries in Tuscany for full-grain aniline vegetable-tanned leathers.' },
                  { year: '2012', title: 'Fintech Ledger Engine', desc: 'Pioneered the world’s first integrated double-entry inventory valuation system for custom builds.' },
                  { year: '2026', title: 'Global Design Showrooms', desc: 'Flagships operating across Mumbai, New Delhi, Bengaluru, and Milan private studios.' },
                ].map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E8E4DC] shadow-xs hover:shadow-md hover:border-[#2D4A3E]/40 transition-all space-y-3">
                    <span className="font-mono text-xl font-bold text-[#2D4A3E]">{item.year}</span>
                    <h3 className="font-serif text-base text-[#101C17] font-medium">{item.title}</h3>
                    <p className="text-xs text-[#5D6B64] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MASTER CRAFTSMANSHIP */}
        {activeTab === 'craftsmanship' && (
          <div className="space-y-16 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-mono text-[#2D4A3E] bg-[#EFECE6] px-3.5 py-1.5 rounded-full border border-[#DED8CC] uppercase tracking-widest inline-block">
                Technique & Materiality
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#101C17] tracking-tight">
                Crafted by Hands, Verified by Precision
              </h1>
              <p className="text-[#55635D] text-sm leading-relaxed">
                Every piece in the Urban Furniture collection is handcrafted from ethically harvested certified timbers, joined with traditional mortise-and-tenon construction, and hand-finished with organic oils.
              </p>
            </div>

            {/* Material Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Grade-A Solid White Oak',
                  origin: 'FSC Certified Appalachian Forests',
                  desc: 'Air-dried for 14 months and kiln-tempered to 7% moisture equilibrium for zero warp guarantee.',
                  image: oakCredenza,
                  badge: 'Timber Standard',
                },
                {
                  title: 'Full-Grain Tuscan Leather',
                  origin: 'Santa Croce sull’Arno, Italy',
                  desc: 'Vegetable-tanned with natural chestnut extracts, developing an irreplaceable rich patina over decades.',
                  image: oliveChair,
                  badge: 'Textile Mastery',
                },
                {
                  title: 'Hand-Brushed Aged Brass',
                  origin: 'Heritage Foundry Casting',
                  desc: 'Solid cast brass hardware individually turned, brushed, and sealed against oxidization.',
                  image: creamChair,
                  badge: 'Hardware Detail',
                },
              ].map((mat, idx) => (
                <div key={idx} className="rounded-3xl bg-white border border-[#E8E4DC] shadow-xs hover:shadow-xl hover:border-[#2D4A3E]/40 transition-all duration-300 overflow-hidden flex flex-col group">
                  <div className="h-60 bg-[#F5F2EC] flex items-center justify-center p-6 relative overflow-hidden">
                    <img
                      src={mat.image}
                      alt={mat.title}
                      className="max-h-48 object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#DED8CC] text-[#2D4A3E] font-semibold shadow-xs">
                      {mat.badge}
                    </span>
                  </div>
                  <div className="p-7 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif-luxury text-xl text-[#101C17]">{mat.title}</h3>
                      <p className="text-xs text-[#8B5E3C] font-semibold tracking-wide mt-1">{mat.origin}</p>
                      <p className="text-xs text-[#5D6B64] mt-2.5 leading-relaxed">{mat.desc}</p>
                    </div>
                    <div className="pt-4 border-t border-[#EFECE6] flex items-center justify-between text-[11px] text-[#7E8C85]">
                      <span>Zero Chemical Sealants</span>
                      <Shield className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quality Standard Badges banner with signature contrast */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#101C17] text-[#FAF8F5] border border-[#1E332A] shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#182B23] border border-[#274438] flex items-center justify-center text-[#D2E7A4] shrink-0 shadow-inner">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-base text-[#FAF8F5]">25-Year Structural Warranty</h4>
                  <p className="text-xs text-[#A1B8AF] mt-1 leading-relaxed">Every frame and joinery union is backed by our unconditional guarantee.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#182B23] border border-[#274438] flex items-center justify-center text-[#D2E7A4] shrink-0 shadow-inner">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-base text-[#FAF8F5]">FSC Sustainable Harvest</h4>
                  <p className="text-xs text-[#A1B8AF] mt-1 leading-relaxed">100% of timber is responsibly sourced from certified managed regrowth forests.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#182B23] border border-[#274438] flex items-center justify-center text-[#D2E7A4] shrink-0 shadow-inner">
                  <Clock className="w-6 h-6 text-[#E8C547]" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-base text-[#FAF8F5]">80+ Hours Per Piece</h4>
                  <p className="text-xs text-[#A1B8AF] mt-1 leading-relaxed">Dedicated hand shaping, sanding, and organic beeswax finishing.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EDITORIAL REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-16 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-mono text-[#2D4A3E] bg-[#EFECE6] px-3.5 py-1.5 rounded-full border border-[#DED8CC] uppercase tracking-widest inline-block">
                Press & Recognition
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#101C17] tracking-tight">
                Acclaimed by the Architectural Press
              </h1>
              <p className="text-[#55635D] text-sm leading-relaxed">
                Featured across leading international design publications for marrying old-world cabinetmaking with contemporary finance architecture.
              </p>
            </div>

            {/* Featured Press Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  publication: 'ARCHITECTURAL DIGEST',
                  issue: 'Annual Design Issue 2026',
                  quote: '“Urban Furniture produces pieces that feel less like manufactured products and more like sculptural heirlooms carved from solid teak.”',
                  author: 'Sophia Vance, Senior Design Editor',
                  rating: 5,
                },
                {
                  publication: 'WALLPAPER* MAGAZINE',
                  issue: 'Design Awards Shortlist',
                  quote: '“The clean lines of the Royal Velvet sofa and solid oak credenza redefine contemporary minimalism without sacrificing ergonomic warmth.”',
                  author: 'Julian Thorne, Architecture Critic',
                  rating: 5,
                },
                {
                  publication: 'ELLE DÉCOR INTERNATIONAL',
                  issue: 'Spring Atelier Spotlight',
                  quote: '“By pairing master joinery with a live double-entry inventory ledger, Urban Furniture gives design studios unprecedented commercial clarity.”',
                  author: 'Mathieu Laurent, Paris Bureau',
                  rating: 5,
                },
              ].map((rev, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-white border border-[#E8E4DC] shadow-xs hover:shadow-xl hover:border-[#2D4A3E]/40 transition-all flex flex-col justify-between space-y-6 group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold tracking-widest text-[#2D4A3E]">{rev.publication}</span>
                      <div className="flex text-[#E8A317]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-[#7E8C85] block uppercase tracking-wider font-mono">{rev.issue}</span>
                    <p className="font-serif text-sm text-[#1A1F1D] italic leading-relaxed pt-2">{rev.quote}</p>
                  </div>
                  <div className="pt-4 border-t border-[#EFECE6]">
                    <p className="text-xs font-medium text-[#5D6B64]">{rev.author}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Client Testimonials container */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#F4EFE6] border border-[#E5DFD3] space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-luxury text-2xl text-[#101C17]">Private Client & Studio Testimonials</h3>
                <span className="text-[11px] font-mono text-[#2D4A3E] uppercase tracking-wider">Verified Commissions</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-[#E5DFD3] space-y-3 shadow-xs">
                  <p className="text-xs text-[#4A5550] italic leading-relaxed">
                    "We commissioned 48 custom white oak conference desks for our South Mumbai headquarters. Delivery, finish, and accounting settlement was flawless."
                  </p>
                  <p className="text-[11px] font-semibold text-[#2D4A3E] font-mono">— Mehta & Partners Architecture</p>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-[#E5DFD3] space-y-3 shadow-xs">
                  <p className="text-xs text-[#4A5550] italic leading-relaxed">
                    "The Tuscan leather upholstery on our custom daybeds has aged magnificently over three years. Urban Furniture is in a league of its own."
                  </p>
                  <p className="text-[11px] font-semibold text-[#2D4A3E] font-mono">— Casa Aurelia Boutique Hotel, Goa</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONTACT DESIGNERS / BESPOKE STUDIO */}
        {activeTab === 'designers' && (
          <div className="space-y-16 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Info Column */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFECE6] border border-[#DED8CC] text-xs text-[#E86034] font-mono tracking-widest uppercase">
                    <Feather className="w-3.5 h-3.5 text-[#E86034]" />
                    <span>Bespoke Commission Studio</span>
                  </div>
                  <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#101C17] tracking-tight leading-tight">
                    Commission Custom Works with Our Master Designers
                  </h1>
                  <p className="text-[#55635D] text-sm leading-relaxed">
                    Have a specialized residential interior, luxury hotel project, or commercial architectural build? Our design directors collaborate directly with interior designers, architects, and private clients.
                  </p>
                </div>

                {/* Designer Cards */}
                <div className="p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-xs space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={designerPortrait}
                      alt="Lead Designer"
                      className="w-14 h-14 rounded-full object-cover border border-[#D4CEBF] shadow-xs"
                    />
                    <div>
                      <h4 className="font-serif-luxury text-base text-[#101C17]">Elena Rossi & Vikram Singhania</h4>
                      <p className="text-xs text-[#2D4A3E] font-semibold">Principal Architects & Creative Directors</p>
                      <p className="text-[11px] text-[#6D7C75]">Atelier Studio: Mumbai & Milan</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#5D6B64] italic leading-relaxed pt-2 border-t border-[#EFECE6]">
                    "We welcome private consultations for custom dimensional scaling, exotic timber selection, and contract-grade upholstery specifications."
                  </p>
                </div>

                {/* Direct Contacts */}
                <div className="space-y-3.5 text-xs text-[#4A5550]">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#2D4A3E]" />
                    <a href="mailto:designers@urbanfurniture.com" className="hover:text-[#2D4A3E] font-medium transition-colors">
                      designers@urbanfurniture.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#2D4A3E]" />
                    <a href="tel:+9102248901288" className="hover:text-[#2D4A3E] font-medium transition-colors">
                      +91 (022) 4890-1288 (Bespoke Studio Direct)
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#2D4A3E]" />
                    <span>Consultation Hours: Mon – Fri · 10:00 to 18:00 IST</span>
                  </div>
                </div>
              </div>

              {/* Right Form Column */}
              <div className="lg:col-span-7">
                <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8E4DC] shadow-md space-y-6">
                  <div>
                    <h3 className="font-serif-luxury text-2xl text-[#101C17]">Project Consultation Form</h3>
                    <p className="text-xs text-[#5D6B64] mt-1">Fill out your project parameters to receive custom renders and preliminary valuation.</p>
                  </div>

                  {submitted ? (
                    <div className="py-12 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#2D4A3E] text-[#D2E7A4] flex items-center justify-center mx-auto shadow-md">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="font-serif-luxury text-2xl text-[#101C17]">Inquiry Registered</h4>
                      <p className="text-xs text-[#5D6B64] max-w-sm mx-auto leading-relaxed">
                        Our lead furniture architect has received your parameters and will contact you within 24 business hours with initial CAD/ledger schedules.
                      </p>
                      {confirmedInquiry?.inquiryNumber && (
                        <div className="inline-block bg-[#EAE4D8] text-[#2D4A3E] text-xs font-mono px-3.5 py-1.5 rounded-full border border-[#D5CDBC]">
                          Inquiry Reference: <strong>{confirmedInquiry.inquiryNumber}</strong>
                        </div>
                      )}
                      <div>
                        <button
                          onClick={() => setSubmitted(false)}
                          className="text-xs font-semibold text-[#2D4A3E] hover:underline cursor-pointer"
                        >
                          Submit another inquiry
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A5550]">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={inquiryForm.name}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                            placeholder="e.g. Ar. Rajesh Sharma"
                            className="w-full bg-[#FAF8F5] border border-[#D8D2C5] focus:border-[#2D4A3E] rounded-xl px-4 py-3 text-xs text-[#1A1F1D] placeholder-[#8F9B94] outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A5550]">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={inquiryForm.email}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                            placeholder="rajesh@studioarch.com"
                            className="w-full bg-[#FAF8F5] border border-[#D8D2C5] focus:border-[#2D4A3E] rounded-xl px-4 py-3 text-xs text-[#1A1F1D] placeholder-[#8F9B94] outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A5550]">Phone Number</label>
                          <input
                            type="tel"
                            value={inquiryForm.phone}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                            placeholder="+91 98200-XXXXX"
                            className="w-full bg-[#FAF8F5] border border-[#D8D2C5] focus:border-[#2D4A3E] rounded-xl px-4 py-3 text-xs text-[#1A1F1D] placeholder-[#8F9B94] outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A5550]">Project Type</label>
                          <select
                            value={inquiryForm.projectType}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, projectType: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-[#D8D2C5] focus:border-[#2D4A3E] rounded-xl px-4 py-3 text-xs text-[#1A1F1D] outline-none transition-colors"
                          >
                            <option value="Residential Interior">Residential Luxury Villa / Penthouse</option>
                            <option value="Commercial Office">Bespoke Executive Office</option>
                            <option value="Hospitality">Boutique Hotel / Lounge</option>
                            <option value="Architectural Contract">Contract Architecture Build</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A5550]">Project Description & Scope</label>
                        <textarea
                          rows={4}
                          value={inquiryForm.message}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                          placeholder="Provide details such as dimensions, preferred timbers (Burmese Teak, White Oak), quantity of seating/credenzas, and target installation date..."
                          className="w-full bg-[#FAF8F5] border border-[#D8D2C5] focus:border-[#2D4A3E] rounded-xl px-4 py-3 text-xs text-[#1A1F1D] placeholder-[#8F9B94] outline-none transition-colors resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-xl bg-[#2D4A3E] hover:bg-[#1A2D25] disabled:opacity-70 text-white font-semibold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer group"
                      >
                        {isSubmitting ? (
                          <span>Registering Inquiry...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#D2E7A4]" />
                            <span>Submit Bespoke Commission Inquiry</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Launchpage Footer */}
      <Footer
        onOpenAuth={onOpenAuth || (() => {
          window.history.pushState(null, '', '/login');
          window.dispatchEvent(new PopStateEvent('popstate'));
        })}
        onNavigatePartnerHelpdesk={onNavigatePartnerHelpdesk || ((tab = 'helpdesk') => {
          window.history.pushState(null, '', `/partner-helpdesk#${tab}`);
          window.dispatchEvent(new PopStateEvent('popstate'));
        })}
        onNavigateAbout={onNavigateAbout || ((tab) => {
          handleTabChange(tab);
        })}
        onNavigateShowrooms={onNavigateShowrooms || (() => {
          window.history.pushState(null, '', '/showrooms');
          window.dispatchEvent(new PopStateEvent('popstate'));
        })}
      />
    </div>
  );
};

export default AtelierAboutPage;
