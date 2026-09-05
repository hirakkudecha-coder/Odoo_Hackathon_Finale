const TradePartner = require('../models/TradePartner');

// Helper to determine tier & margin based on annual procurement volume
const calculateTier = (volume) => {
  const vol = Number(volume) || 0;
  if (vol < 2000000) {
    return { tier: 'Silver Atelier', commissionRate: 20 };
  } else if (vol < 5000000) {
    return { tier: 'Gold Studio Guild', commissionRate: 28 };
  } else {
    return { tier: 'Platinum Master Guild', commissionRate: 35 };
  }
};

// Register studio for Trade Partner Guild privileges
const applyTradePartner = async (req, res, next) => {
  try {
    const {
      studioName,
      contactPerson,
      email,
      phone,
      gstin,
      website,
      procurementVolume
    } = req.body;

    if (!studioName || !contactPerson || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Studio name, contact person, email, and phone are required.'
      });
    }

    const { tier, commissionRate } = calculateTier(procurementVolume);

    const partner = await TradePartner.create({
      studioName,
      contactPerson,
      email,
      phone,
      gstin: gstin || '',
      website: website || '',
      procurementVolume: Number(procurementVolume) || 2500000,
      tier,
      commissionRate,
      status: 'approved'
    });

    res.status(201).json({
      success: true,
      message: 'Studio registered for trade privileges successfully.',
      partner
    });
  } catch (error) {
    next(error);
  }
};

// Get all trade partners
const getTradePartners = async (req, res, next) => {
  try {
    const partners = await TradePartner.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: partners.length,
      partners
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyTradePartner,
  getTradePartners
};
