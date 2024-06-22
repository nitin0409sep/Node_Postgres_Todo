const express = require("express");

const { getProfile } = require("../controller/profile.controller");

const route = express.Router();

route.get("/", getProfile);

module.exports = route;
