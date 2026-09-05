const express = require('express');
const router = express.Router();
const { getShowrooms, bookTour, getBookings } = require('../controllers/showroomController');

router.get('/', getShowrooms);
router.post('/book-tour', bookTour);
router.get('/bookings', getBookings);

module.exports = router;
