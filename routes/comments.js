const express = require('express');
const mongoose = require('mongoose');

const router =express.Router();

const User = require('../models/User');
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

router.post('/', (req, res, next) => {
  let isLoggedIn = false;
  let username = null;
  let userId = null;

  if(req.userData) {
    isLoggedIn = true;
    username = req.userData.username;
    userId = req.userData.id;
  }

  if(!req.body.userId) userId = "5fdb19b606f5464de3ba5ebf";
  else if(req.body.userId != userId) return res.status(500).json({error: "Auth error"});

  Blog.findOne({_id: req.body.blogId}, (err, blog) => {
    if(err) return res.status(500).json({error: err});

    let newComment = new Comment({
      _id: mongoose.Types.ObjectId(),
      body: req.body.body,
      posted_by: userId,
    });

    newComment.save((err) => {
      if(err) return res.status(500).json({error: err});
      blog.comments.unshift(newComment._id);
      blog.save((err) => {
        if(err) return res.status(500).json({error: err});
        res.status(200);
        return res.redirect(req.get('referer'));
      });
    });
  });
});

module.exports = router;
