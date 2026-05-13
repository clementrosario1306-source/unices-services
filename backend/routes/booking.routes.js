const router = require('express').Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateStatus,
  cancelBooking,
  getStats
} = require('../controllers/booking.controller');

router.post('/',                createBooking);    // Create booking
router.get('/user/:userId',     getUserBookings);  // User's bookings
router.get('/all',              getAllBookings);    // Admin - all bookings
router.get('/stats',            getStats);         // Admin - stats
router.put('/status/:id',       updateStatus);     // Admin - update status
router.put('/cancel/:id',       cancelBooking);    // Cancel booking

module.exports = router;