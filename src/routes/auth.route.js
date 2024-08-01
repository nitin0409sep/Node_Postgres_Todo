const express = require('express');

const route = express.Router();

const { registerUser, loginUser, getUsers } = require('../controller/auth.controller');

const { authenticateUser } = require('../middlewares/authorization.middleware');

// Get All Users
route.get('/', authenticateUser, getUsers);

// For Login
route.post('/register', registerUser);

// For Registration
route.post('/login', loginUser);

module.exports = route;