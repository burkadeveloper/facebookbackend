// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const voteRoutes = require("./routes/vote");

const app = express();

// --- CORS Configuration (critical for deployed frontend) ---
const allowedOrigins = [
  "http://localhost:5173", // Vite default local
  "http://localhost:3000", // Alternative local
  "https://facebook-rosy-alpha.vercel.app", // Your deployed frontend
  // Add any other domains you use
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "CORS policy does not allow this origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // if you use cookies/sessions
  }),
);
// ---------------------------------------------------------

app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", voteRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
