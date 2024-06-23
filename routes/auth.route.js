const express = require('express');

const route = express.Router();

const { registerUser, loginUser, getUsers } = require('../controller/auth.controller');

// Get All Users
route.get('/', getUsers);

// For Login
route.post('/register', registerUser);

// For Registration
route.post('/login', loginUser);

module.exports = route;