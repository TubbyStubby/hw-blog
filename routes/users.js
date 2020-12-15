const express = require('express');
const mongoose = require('mongoose');
// TODO: add auth

const router = express.Router();

const User = require('../models/User');

router.get('/login', (req, res, next) => {
  res.render('index', {
    heading: "User Login",
    blogs: [],
  })
});

module.exports = router;