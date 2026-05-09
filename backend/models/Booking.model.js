const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:        { type: String, required: true },
  phone:       { type: String, required: true },
  service:     { type: String, required: true },
  price:       { type: Number, required: true },
  date:        { type: String, required: true },
  timeSlot:    { type: String, required: true },
  address:     { type: String, required: true },
  status:      { type: String, default: 'Pending', enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'] },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);