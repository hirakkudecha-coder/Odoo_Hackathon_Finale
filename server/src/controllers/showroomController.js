const ShowroomTour = require('../models/ShowroomTour');

// Static showroom master metadata
const SHOWROOMS = [
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

// Get list of all showrooms
const getShowrooms = (req, res) => {
  res.status(200).json({
    success: true,
    count: SHOWROOMS.length,
    showrooms: SHOWROOMS
  });
};

// Book a private atelier tour
const bookTour = async (req, res, next) => {
  try {
    const { showroom, name, email, phone, date, timeSlot, guests, notes } = req.body;

    if (!showroom || !name || !email || !date) {
      return res.status(400).json({
        success: false,
        message: 'Showroom, name, email, and date are required.'
      });
    }

    const booking = await ShowroomTour.create({
      showroom,
      name,
      email,
      phone: phone || '',
      date,
      timeSlot: timeSlot || '11:00 AM - 12:30 PM',
      guests: guests || '2 Guests',
      notes: notes || '',
      status: 'confirmed'
    });

    res.status(201).json({
      success: true,
      message: 'Atelier tour reserved successfully.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// Get all bookings
const getBookings = async (req, res, next) => {
  try {
    const bookings = await ShowroomTour.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// Update booking status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await ShowroomTour.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Tour booking not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tour booking status updated successfully.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShowrooms,
  bookTour,
  getBookings,
  updateBookingStatus
};

