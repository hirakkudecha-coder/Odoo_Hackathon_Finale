const express = require('express');
const router = express.Router();
const { getShowrooms, bookTour, getBookings, updateBookingStatus } = require('../controllers/showroomController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', getShowrooms);
router.post('/book-tour', bookTour);

// Protected staff endpoints
router.get('/bookings', authenticate, authorize('admin', 'accountant'), getBookings);
router.patch('/bookings/:id/status', authenticate, authorize('admin', 'accountant'), updateBookingStatus);

module.exports = router;

