require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/vote');

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://facebook-rosy-alpha.vercel.app',
  'https://facebook-rust-tau.vercel.app', 
  'https://facebook-l5xf.vercel.app' 
];

// --- CORS Configuration: allow any https://facebook* origin ---
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow any origin that starts with 'https://facebook'
    if (origin.startsWith('https://facebook')) {
      return callback(null, true);
    }
    
    // Block all other origins
    const msg = 'CORS policy does not allow this origin.';
    return callback(new Error(msg), false);
  },
  credentials: true, // if you use cookies/sessions
}));
// -----------------------------------------------------------
// -------------------------

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', voteRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
