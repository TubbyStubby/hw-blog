const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

router.get('/one/:blogId?', (req, res, next) => {
  Blog.findOne({_id: req.params.blogId}, (err, blog) => {
    if(err) {
      console.log(err);
      return res.status(501).json({error: err});
    }

    res.render('blog-template', {
      blog: blog,
    });
  });
});

router.get('/new', (req, res, next) => {
  let isLoggedIn = false;
  let username = null;

  if(req.userData) {
    isLoggedIn = true;
    username = req.userData.username;
  }

  if(isLoggedIn) {
    res.render('new-blog');
  }
  else return res.status(500).json({error: 'Not logged in'});
});


router.post('/new', (req, res, next) => {
  let isLoggedIn = false;
  let username = null;
  let userid = null;

  if(req.userData) {
    isLoggedIn = true;
    username = req.userData.username;
    userid = req.userData.id;
  }

  if(isLoggedIn) {
    let newBlog = new Blog({
      _id: mongoose.Types.ObjectId(),
      title: req.body.title,
      body: req.body.body,
      posted_by: userid,
      time_posted: Date.now(),
    });

    newBlog.save((err) => {
      if(err) return res.status(500).json({error: err})

      res.redirect('/blogs/one/' + newBlog._id);
    });
  }
  else return res.status(500).json('Not logged in');
});
module.exports = router;