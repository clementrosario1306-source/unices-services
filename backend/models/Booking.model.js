const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId:    { type: String, default: 'guest' },
  name:      { type: String, required: true },
  phone:     { type: String, required: true },
  email:     { type: String },
  service:   { type: String, required: true },
  price:     { type: Number, required: true },
  date:      { type: String, required: true },
  timeSlot:  { type: String, required: true },
  address:   { type: String, required: true },
  notes:     { type: String },
  payment:   { type: String, default: 'upi' },
  status:    { type: String, default: 'Pending', enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'] },
  staffName: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);