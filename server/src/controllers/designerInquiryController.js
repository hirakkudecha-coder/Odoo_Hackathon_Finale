const DesignerInquiry = require('../models/DesignerInquiry');

// Create a new bespoke designer commission inquiry
const createInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, projectType, estimatedBudget, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required to submit an inquiry.'
      });
    }

    const inquiry = await DesignerInquiry.create({
      name,
      email,
      phone: phone || '',
      projectType: projectType || 'Residential Interior',
      estimatedBudget: estimatedBudget || '$25,000 - $50,000',
      message: message || ''
    });

    res.status(201).json({
      success: true,
      message: 'Bespoke design commission inquiry submitted successfully.',
      inquiry
    });
  } catch (error) {
    next(error);
  }
};

// Get all designer inquiries
const getInquiries = async (req, res, next) => {
  try {
    const inquiries = await DesignerInquiry.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry,
  getInquiries
};
