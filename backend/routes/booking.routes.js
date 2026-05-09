


// ===== booking.routes.js =====
// Save this as: backend/routes/booking.routes.js

const router2 = require('express').Router();
const { createBooking, getBookings, cancelBooking } = require('../controllers/booking.controller');

router2.post('/', createBooking);
router2.get('/', getBookings);
router2.put('/cancel/:id', cancelBooking);

module.exports = router2;