const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',     require('./routes/auth.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/chat',     require('./routes/chatbot.routes'));

// Test route
app.get('/', (req, res) => res.json({ message: '🚀 Unices Services API is running!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));