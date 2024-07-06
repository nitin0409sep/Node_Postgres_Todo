const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// DB Connection
require("../db-config/connection.js");

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Use this middleware to parse incoming requests with URL-encoded payloads (e.g., form submissions)
app.use(express.json()); // Use this middleware to parse incoming requests with JSON payloads.

// Routes
const authRoutes = require("../routes/auth.route.js");
const profileRoutes = require("../routes/profile.route.js");
const todoRoutes = require("../routes/user_todo.routes.js");

app.use('/api/data/auth', authRoutes);
app.use('/api/data/profile', profileRoutes);
app.use('/api/data/todo', todoRoutes);

// Error handling middleware 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
