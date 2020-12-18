const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/User');

router.get('/login', (req, res, next) => {
  res.render('signup-login-form', {
    loggedIn: false,
    heading: "User Login",
    formAction: '/users/login',
    value: 'Login'
  });
});

router.get('/signup', (req, res, next) => {
  res.render('signup-login-form', {
    loggedIn: false,
    heading: 'Signup',
    formAction: '/users/signup',
    value: 'Signup'
  });
});

router.get('/logout', (req, res, next) => {
  res.clearCookie('authToken');
  return res.redirect('/');
});

// TODO: add error toast
router.post('/login', (req, res, next) => {
  User.findOne({username: req.body.username}, (err, user) => {
    if(user) {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if(err) return res.status(401).json({auth: false});
        if(result) {
          const token = jwt.sign(
            {
              username: user.username,
              id: user._id
            },
            process.env.HWBLOG_JWT_KEY || "1234",
            {
              expiresIn: '1h',
            },
          );
          res.cookie("authToken", token);
          return res.redirect('/');
        }

        return res.status(401).json({auth: false, error: err});
      });
    }
  });
});

// TODO: add error toast
router.post('/signup', (req, res, next) => {
  User.find({username: req.body.username}, (err, users) => {
    if(users.length > 0) return res.status(409).json({error: 'User already exists'});

    bcrypt.hash(req.body.password, 1, (err, hash) => {
      if(err) return res.status(500).json({error: err});

      let user = new User({
        _id: mongoose.Types.ObjectId(),
        username: req.body.username,
        password: hash,
      });

      user.save((err) => {
        if(err) return res.status(500).json({error: err});
        res.redirect('/users/login');
      });
    });
  });
});

module.exports = router;