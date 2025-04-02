require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB().catch((err) => {
  console.error("MongoDB Connection Failed:", err);
  process.exit(1);
});

// Message Schema
const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Root route for testing
app.get("/", (req, res) => {
  res.status(200).send("Server is running on Vercel 🚀");
});

// Contact Route
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    // Save to database
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    // Send email to client email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CLIENT_EMAIL,
      subject: "New Contact Form Message",
      text: `You received a new message from:
      Name: ${name}
      Email: ${email}
      Message: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Export app for Vercel serverless deployment
module.exports = app;

// Ensure server listens in local environment (not serverless)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
