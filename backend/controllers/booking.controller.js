const Booking = require('../models/Booking.model');

// CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ message: '✅ Booking confirmed!', booking });
  } catch (err) {
    res.status(500).json({ message: 'Error creating booking', error: err.message });
  }
};

// GET ALL BOOKINGS (for a user)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
};

// CANCEL BOOKING
exports.cancelBooking = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: 'Cancelled' });
    res.json({ message: 'Booking cancelled!' });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling booking', error: err.message });
  }
};