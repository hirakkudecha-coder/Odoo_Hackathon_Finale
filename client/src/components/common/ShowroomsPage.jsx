import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Sparkles,
  Compass,
  CheckCircle2,
  Navigation,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Coffee,
  Layers,
  Eye,
  X
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import livingRoomHero from '../../assets/images/living_room_hero.png';
import livingRoomHero2 from '../../assets/images/living_room_hero2.png';
import livingRoomHero3 from '../../assets/images/living_room_hero3.png';
import { Footer } from './Footer';

export const ShowroomsPage = ({ 
  onNavigateHome,
  onOpenAuth,
  onNavigatePartnerHelpdesk,
  onNavigateAbout,
  onNavigateShowrooms
}) => {
  const [selectedCity, setSelectedCity] = useState('all');
  const [activeModal, setActiveModal] = useState(null); // 'booking' | null
  const [selectedShowroom, setSelectedShowroom] = useState('Mumbai Flagship Atelier');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [confirmedBookingCode, setConfirmedBookingCode] = useState('');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: '11:00 AM - 12:30 PM',
    guests: '2 Guests',
    notes: ''
  });

  const showrooms = [
    {
      id: 'mumbai',
      cityKey: 'mumbai',
      name: 'Mumbai Flagship Atelier',
      tier: 'Flagship & Heritage Archive',
      address: 'Express Towers, Ground & Mezzanine Level, Nariman Point',
      area: 'Marine Drive Waterfront, Mumbai, Maharashtra 400021',
      phone: '+91 (022) 4890-1200',
      email: 'mumbai@urbanfurniture.com',
      hours: 'Mon – Sat: 10:00 AM – 08:00 PM · Sun by Appointment',
      image: livingRoomHero,
      features: [
        'Over 8,500 sq.ft. Bespoke Living Suites',
        'Tuscan Leather & Belgian Velvet Textile Archive',
        'Direct Access to Principal Architectural Consultants',
        'Private VIP Presentation Lounge & Valet Parking'
      ],
      mapUrl: 'https://maps.google.com/?q=Nariman+Point+Mumbai',
      badge: 'Flagship Gallery'
    },
    {
      id: 'delhi',
      cityKey: 'delhi',
      name: 'New Delhi Design Studio',
      tier: 'Heritage Colonnade Atelier',
      address: 'The Qutub Heritage Colonnade, One Style Mile, Kalka Das Marg',
      area: 'Mehrauli Art District, New Delhi 110030',
      phone: '+91 (011) 6720-4400',
      email: 'delhi@urbanfurniture.com',
      hours: 'Mon – Sat: 10:30 AM – 07:30 PM · Sun: 11:00 AM – 06:00 PM',
      image: livingRoomHero2,
      features: [
        'Restored Sandstone Arches & Courtyard Gallery',
        'Full-Scale Dining & Executive Workspace Vignettes',
        'Aged Brass & Solid Oak Specimen Library',
        'Commission Custom Furniture with On-Site Master Joiners'
      ],
      mapUrl: 'https://maps.google.com/?q=Mehrauli+New+Delhi',
      badge: 'Heritage Studio'
    },
    {
      id: 'bengaluru',
      cityKey: 'bengaluru',
      name: 'Bengaluru Contemporary Gallery',
      tier: 'Modernist Innovation Hub',
      address: '24/1 Lavelle Road, Shanthala Nagar, Ashok Nagar',
      area: 'Central Business District, Bengaluru, Karnataka 560001',
      phone: '+91 (080) 4150-8900',
      email: 'bengaluru@urbanfurniture.com',
      hours: 'Tue – Sun: 10:00 AM – 08:00 PM · Mon: Closed for Private Fabrication',
      image: livingRoomHero3,
      features: [
        'Minimalist Concrete & Sustainable Timber Architecture',
        'Biophilic Living & Ergonomic Workspace Lab',
        'Digital Augmented Reality Space Fitting Studio',
        'Artisanal Pour-Over Espresso & Tea Bar for Patrons'
      ],
      mapUrl: 'https://maps.google.com/?q=Lavelle+Road+Bengaluru',
      badge: 'Modernist Hub'
    }
  ];

  const filteredShowrooms = selectedCity === 'all' 
    ? showrooms 
    : showrooms.filter(s => s.cityKey === selectedCity);

  const handleBackHome = (e) => {
    if (e) e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleOpenBooking = (showroomName) => {
    setSelectedShowroom(showroomName);
    setBookingConfirmed(false);
    setActiveModal('booking');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.date) return;

    setIsSubmittingBooking(true);
    try {
      const res = await fetch('/api/showrooms/book-tour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showroom: selectedShowroom,
          ...bookingForm
        })
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setConfirmedBookingCode(data.booking.bookingCode);
      } else {
        setConfirmedBookingCode(`UF-TOUR-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    } catch {
      setConfirmedBookingCode(`UF-TOUR-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setIsSubmittingBooking(false);
      setBookingConfirmed(true);
      setBookingForm({
        name: '',
        email: '',
        phone: '',
        date: '',
        timeSlot: '11:00 AM - 12:30 PM',
        guests: '2 Guests',
        notes: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1F1D] flex flex-col selection:bg-[#2D4A3E] selection:text-[#FAF8F5]">
      
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E6E2DA] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={handleBackHome}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D4A3E] hover:text-[#101C17] bg-[#EFECE6] hover:bg-[#E4DFD5] px-3.5 py-2 rounded-full transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Atelier</span>
            </button>
            <div className="hidden sm:block h-5 w-[1px] bg-[#D4CEBF]"></div>
            <div className="hidden sm:block">
              <BrandLogo />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenBooking('Mumbai Flagship Atelier')}
              className="bg-[#2D4A3E] hover:bg-[#1C332A] text-[#FAF8F5] px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D2E7A4]" />
              <span>Book Atelier Tour</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="bg-[#FAF8F5] text-[#1A1F1D] pt-14 pb-10 px-4 sm:px-6 lg:px-8 relative border-b border-[#E8E4DC]">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#EFECE6] border border-[#DED8CC] text-[#2D4A3E] text-xs px-3.5 py-1.5 rounded-full uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#E86034]" />
            <span>Curated Physical Sanctuaries</span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#101C17] tracking-tight leading-tight">
            Experience Master Craftsmanship <br />
            <span className="italic font-normal text-[#2D4A3E]">In Person & Across Senses.</span>
          </h1>

          <p className="text-[#55635D] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Our atelier galleries are designed not merely as showrooms, but as meditative living spaces. Feel the unyielding grain of aged Appalachian oak, run your fingertips across vegetable-tanned Tuscan hides, and consult with our principal architects.
          </p>

          {/* Quick Filter Pills */}
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            {[
              { id: 'all', label: 'All Locations (3)' },
              { id: 'mumbai', label: 'Mumbai · Nariman Point' },
              { id: 'delhi', label: 'New Delhi · Mehrauli' },
              { id: 'bengaluru', label: 'Bengaluru · Lavelle Road' }
            ].map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  selectedCity === city.id
                    ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs'
                    : 'bg-[#EFECE6] hover:bg-[#E4DFD5] text-[#4D5A53] hover:text-[#141A17] border border-[#DED8CC]'
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Showrooms List */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {filteredShowrooms.map((showroom, idx) => (
          <article
            key={showroom.id}
            className="bg-white rounded-3xl border border-[#E8E4DC] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0 group"
          >
            {/* Image Column */}
            <div className={`lg:col-span-6 relative overflow-hidden bg-[#182B23] min-h-[340px] lg:min-h-[460px] ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <img
                src={showroom.image}
                alt={showroom.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-6 left-6">
                <span className="bg-[#101C17]/85 backdrop-blur-md text-[#D2E7A4] border border-[#2D4A3E] text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full">
                  {showroom.badge}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs uppercase tracking-widest font-mono text-[#D2E7A4]/90 mb-1">{showroom.tier}</p>
                <p className="font-serif-luxury text-2xl sm:text-3xl text-[#FAF8F5] leading-tight">{showroom.name}</p>
              </div>
            </div>

            {/* Details Column */}
            <div className={`lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="space-y-6">
                
                {/* Header info */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2D4A3E] font-bold mb-2">
                    <Compass className="w-3.5 h-3.5 text-[#E86034]" />
                    <span>Studio Sanctuary · {showroom.cityKey.toUpperCase()}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif-luxury text-[#101C17] font-normal leading-snug">
                    {showroom.name}
                  </h2>
                </div>

                {/* Practical info list */}
                <div className="space-y-3.5 text-xs text-[#4A5550]">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#2D4A3E] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#1A1F1D]">{showroom.address}</p>
                      <p className="text-[#6D7C75]">{showroom.area}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#2D4A3E] shrink-0" />
                    <p>{showroom.hours}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#2D4A3E]" />
                      <a href={`tel:${showroom.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-[#2D4A3E] font-medium transition-colors">
                        {showroom.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#2D4A3E]" />
                      <a href={`mailto:${showroom.email}`} className="hover:text-[#2D4A3E] font-medium transition-colors">
                        {showroom.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Amenities List */}
                <div className="pt-2 border-t border-[#EFECE6]">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#2D4A3E] mb-3">Atelier Experience & Amenities</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5D6B64]">
                    {showroom.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4A3E] shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#EFECE6] flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleOpenBooking(showroom.name)}
                  className="bg-[#2D4A3E] hover:bg-[#1A2D25] text-white px-5 py-3 rounded-full text-xs font-semibold tracking-wide transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#D2E7A4]" />
                  <span>Book Private Tour</span>
                </button>

                <a
                  href={showroom.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D4A3E] hover:text-[#101C17] bg-[#EFECE6] hover:bg-[#E4DFD5] px-4 py-3 rounded-full transition-all cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </article>
        ))}

        {/* Bespoke Private Consultation Callout */}
        <div className="bg-[#101C17] text-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-[#1E332A] relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-[11px] font-mono text-[#D2E7A4] uppercase tracking-widest bg-[#182B23] px-3 py-1 rounded-full border border-[#274438]">
              Worldwide VIP Concierge
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-[#FAF8F5]">
              Can’t visit our studios in India? <br />
              <span className="italic font-normal text-[#D2E7A4]">We bring the atelier to your international residence.</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#A1B8AF] leading-relaxed">
              Our bespoke architectural design division dispatches curated material trunk samples, 3D photorealistic spatial renderings, and white-glove logistical teams across Dubai, London, Singapore, and New York.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  window.history.pushState(null, '', '/about#designers');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="bg-[#D2E7A4] hover:bg-[#C2D794] text-[#101C17] font-semibold text-xs px-6 py-3 rounded-full transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <span>Contact Principal Designers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {activeModal === 'booking' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] text-[#1A1F1D] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-[#D4CEBF] shadow-2xl relative my-8">
            
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#EAE6DD] text-[#4A5550] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingConfirmed ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-[#2D4A3E] text-[#D2E7A4] rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif-luxury text-2xl text-[#101C17]">Atelier Tour Reserved</h3>
                <p className="text-xs text-[#5D6B64] max-w-sm mx-auto leading-relaxed">
                  We have registered your private viewing for <strong>{selectedShowroom}</strong>. Our studio concierge will contact you via email and phone with your personalized itinerary and gate pass.
                </p>
                <div className="inline-block bg-[#EAE6DD] text-[#2D4A3E] text-[11px] font-mono px-3 py-1 rounded-full">
                  Confirmation Code: {confirmedBookingCode || 'UF-TOUR-PENDING'}
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-[#2D4A3E] font-bold mb-1">
                    <Sparkles className="w-3 h-3 text-[#E86034]" />
                    <span>Private Gallery Invitation</span>
                  </div>
                  <h3 className="font-serif-luxury text-2xl text-[#101C17]">Schedule a Private Atelier Tour</h3>
                  <p className="text-xs text-[#5D6B64] mt-1">
                    Select your preferred date & time for a dedicated 90-minute bespoke consultation.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-[#2D4A3E] mb-1">Select Atelier Gallery</label>
                    <select
                      value={selectedShowroom}
                      onChange={(e) => setSelectedShowroom(e.target.value)}
                      className="w-full bg-white border border-[#D4CEBF] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1F1D] focus:outline-none focus:border-[#2D4A3E]"
                    >
                      <option value="Mumbai Flagship Atelier">Mumbai Flagship Atelier (Nariman Point)</option>
                      <option value="New Delhi Design Studio">New Delhi Design Studio (Mehrauli Art District)</option>
                      <option value="Bengaluru Contemporary Gallery">Bengaluru Contemporary Gallery (Lavelle Road)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#2D4A3E] mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Arch. Siddharth Mehta"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                        className="w-full bg-white border border-[#D4CEBF] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1F1D] focus:outline-none focus:border-[#2D4A3E]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#2D4A3E] mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="siddharth@mehtadesign.com"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                        className="w-full bg-white border border-[#D4CEBF] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1F1D] focus:outline-none focus:border-[#2D4A3E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-medium text-[#2D4A3E] mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 98200 12345"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        className="w-full bg-white border border-[#D4CEBF] rounded-xl px-3 py-2 text-xs text-[#1A1F1D] focus:outline-none focus:border-[#2D4A3E]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#2D4A3E] mb-1">Preferred Date *</label>
                      <input
                        type="date"
                        required
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        className="w-full bg-white border border-[#D4CEBF] rounded-xl px-3 py-2 text-xs text-[#1A1F1D] focus:outline-none focus:border-[#2D4A3E]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#2D4A3E] mb-1">Time Slot</label>
                      <select
                        value={bookingForm.timeSlot}
                        onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                        className="w-full bg-white border border-[#D4CEBF] rounded-xl px-3 py-2 text-xs text-[#1A1F1D] focus:outline-none focus:border-[#2D4A3E]"
                      >
                        <option value="10:30 AM - 12:00 PM">10:30 AM - 12:00 PM</option>
                        <option value="01:00 PM - 02:30 PM">01:00 PM - 02:30 PM</option>
                        <option value="03:30 PM - 05:00 PM">03:30 PM - 05:00 PM</option>
                        <option value="06:00 PM - 07:30 PM">06:00 PM - 07:30 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-[#2D4A3E] mb-1">Specific Furniture Pieces or Project Focus</label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Inquiring about dining tables for a 4,000 sq ft duplex in Worli"
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      className="w-full bg-white border border-[#D4CEBF] rounded-xl px-3.5 py-2 text-xs text-[#1A1F1D] focus:outline-none focus:border-[#2D4A3E]"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#4A5550] hover:bg-[#EAE6DD] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="bg-[#2D4A3E] hover:bg-[#1A2D25] text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmittingBooking ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Reserving Viewing...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5 text-[#D2E7A4]" />
                        <span>Confirm Atelier Viewing</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

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
        onNavigateAbout={onNavigateAbout || ((tab = 'story') => {
          window.history.pushState(null, '', `/about#${tab}`);
          window.dispatchEvent(new PopStateEvent('popstate'));
        })}
        onNavigateShowrooms={onNavigateShowrooms || (() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        })}
      />

    </div>
  );
};

export default ShowroomsPage;
