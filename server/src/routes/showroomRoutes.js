const express = require('express');
const router = express.Router();
const { getShowrooms, bookTour, getBookings, updateBookingStatus } = require('../controllers/showroomController');

router.get('/', getShowrooms);
router.post('/book-tour', bookTour);
router.get('/bookings', getBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

module.exports = router;

