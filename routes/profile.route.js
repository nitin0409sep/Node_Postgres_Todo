const express = require("express");

const { getProfile } = require("../controller/profile.controller");

const { authenticateUser } = require('../middlewares/authorization.middleware')

const route = express.Router();

route.get("/", authenticateUser, getProfile);

module.exports = route;
