const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);

// Root
app.get('/', (req, res) => {
  res.send('API Running...');
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
