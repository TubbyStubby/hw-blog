const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

const User = require('../models/User');
const Blog = require('../models/Blog');

router.get('/', (req, res, next) => {
  let isLoggedIn = false;
  let username = null;

  if(req.userData) {
    isLoggedIn = true;
    username = req.userData.username;
  }

  Blog.find({}, null, { sort: {time_posted: -1} }, (err, blogs) => {
      if(err) {
          console.log(err);
      } else {
        res.render('index', {
            heading: 'HW Blog',
            blogs: blogs,
            loggedIn: isLoggedIn,
            username: username,
        });
      }
  });
});

module.exports = router;