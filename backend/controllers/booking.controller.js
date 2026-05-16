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

// GET USER'S OWN BOOKINGS
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
};

// GET ALL BOOKINGS (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
};

// UPDATE BOOKING STATUS (Admin only)
exports.updateStatus = async (req, res) => {
  try {
    const { status, staffName } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, staffName },
      { new: true }
    );
    res.json({ message: '✅ Booking updated!', booking });
  } catch (err) {
    res.status(500).json({ message: 'Error updating booking', error: err.message });
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

// ADD REVIEW
exports.addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { rating, review, reviewDate: new Date().toISOString().split('T')[0] },
      { new: true }
    );
    res.json({ message: '✅ Review added!', booking });
  } catch (err) {
    res.status(500).json({ message: 'Error adding review', error: err.message });
  }
};
exports.getStats = async (req, res) => {
  try {
    const total     = await Booking.countDocuments();
    const pending   = await Booking.countDocuments({ status: 'Pending' });
    const confirmed = await Booking.countDocuments({ status: 'Confirmed' });
    const completed = await Booking.countDocuments({ status: 'Completed' });
    const cancelled = await Booking.countDocuments({ status: 'Cancelled' });

    // Revenue from completed bookings
    const revenueData = await Booking.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const revenue = revenueData[0]?.total || 0;

    res.json({ total, pending, confirmed, completed, cancelled, revenue });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};