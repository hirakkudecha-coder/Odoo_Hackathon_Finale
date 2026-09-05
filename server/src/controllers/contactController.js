const Contact = require('../models/Contact');
const User = require('../models/User');

// Create contact
const createContact = async (req, res, next) => {
  try {
    const { name, type, email, mobile, phone, address, city, state, pincode, createPortalUser, portalPassword, portalEmail } = req.body;
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: name and type are required for contact creation.'
      });
    }

    const contactData = {
      name,
      type,
      email: email || portalEmail || '',
      mobile: mobile || phone || '',
      address: typeof address === 'object' && address !== null ? address : {
        street: address || '',
        city: city || 'Ahmedabad',
        state: state || 'Gujarat',
        pincode: pincode || '380001'
      },
      status: req.body.status || 'active'
    };

    const contact = await Contact.create(contactData);

    let portalUser = null;
    if (createPortalUser && (portalPassword || req.body.password)) {
      const userEmail = (portalEmail || email || '').toLowerCase().trim();
      if (userEmail) {
        let existing = await User.findOne({ email: userEmail });
        if (!existing) {
          portalUser = await User.create({
            name,
            email: userEmail,
            password: portalPassword || req.body.password,
            role: 'contact',
            contactId: contact._id,
            status: 'active'
          });
        } else {
          existing.contactId = contact._id;
          if (portalPassword || req.body.password) {
            existing.password = portalPassword || req.body.password;
          }
          await existing.save();
          portalUser = existing;
        }

        contact.user = portalUser._id;
        await contact.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Contact created successfully' + (portalUser ? ' with portal user credentials.' : ''),
      contact,
      portalUserCreated: !!portalUser
    });
  } catch (error) {
    next(error);
  }
};

// Get all contacts (filter by type if requested)
const getContacts = async (req, res, next) => {
  try {
    const { type, search, status } = req.query;
    const filter = {};

    if (type) {
      if (type === 'Customer') filter.type = { $in: ['Customer', 'Both'] };
      else if (type === 'Vendor') filter.type = { $in: ['Vendor', 'Both'] };
      else filter.type = type;
    }

    if (status) filter.status = status;
    else filter.status = 'active';

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    const contacts = await Contact.find(filter).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    next(error);
  }
};

// Get single contact by ID
const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.status(200).json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};

// Update contact
const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      contact
    });
  } catch (error) {
    next(error);
  }
};

// Delete/Archive contact
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
};
