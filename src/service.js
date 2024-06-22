const express = require("express");

const app = express();

require("dotenv").config();

const cors = require("cors");

const PORT = process.env.PORT;

// DB Connection
require("../db/connection");

// CORS
app.use(cors());

// Use this middleware to parse incoming requests with URL-encoded payloads (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Use this middleware to parse incoming requests with JSON payloads.
app.use(express.json());

// Routes File Link
const profile = require("../routes/profile-route");
const todo = require("../routes/to-do-routes");

// Routes
app.use('/api/data/profile', profile);
app.use('/api/data/todo', todo);

// Port
app.listen(PORT, () => {
  console.log(`Server has started at port ${PORT}`);
});
