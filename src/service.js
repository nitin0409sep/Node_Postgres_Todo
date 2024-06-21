const express = require("express");

const app = express();

require("dotenv").config();

const cors = require("cors");

const bodyParser = require("body-parser");

const PORT = process.env.PORT;

// DB Connection
require("../db/connection");

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// CORS
app.use(cors());

// Body Parser
app.use(bodyParser.json());

// Routes File Link
const todo = require("../routes/to-do-routes");

// Routes
app.use(todo);

// Port
app.listen(PORT, () => {
  console.log(`Server has started at port ${PORT}`);
});
