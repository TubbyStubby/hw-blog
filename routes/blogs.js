const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

router.get('/one/:blogId?', (req, res, next) => {
  let isLoggedIn = false;
  let username = null;
  let userid = null;

  if(req.userData) {
    isLoggedIn = true;
    username = req.userData.username;
    userid = req.userData.id;
  }

  Blog.findOne({_id: req.params.blogId})
  .populate('posted_by', 'username')
  .populate({
    path: 'comments',
    populate: {
      path: 'posted_by',
      select: 'username'
    }
  })
  .exec( (err, blog) => {
    let canDelete = false;

    if(isLoggedIn && blog.posted_by == userid) canDelete = true; 

    if(err) return res.status(501).json({error: err});

    //console.log(blog.comments[1].posted_by);

    res.render('blog-template', {
      blog: blog,
      canDelete: canDelete,
      userId: userid
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
    res.render('blog-form', {
      formAction: '/blogs/new'
    });
  }
  else return res.status(500).json({error: 'Not logged in'});
});

router.get('/update/:blogId?', (req, res, next) => {
  let isLoggedIn = false;
  let username = null;

  if(req.userData) {
    isLoggedIn = true;
    username = req.userData.username;
  }

  if(isLoggedIn) {
    Blog.findOne({_id: req.params.blogId}, (err, blog) => {
      res.render('blog-form', {
        formAction: '/blogs/update/',
        body: blog.body,
        title: blog.title,
        blogId: blog._id,
      });
    });
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

router.post('/delete', (req, res, next) => {
  let isLoggedIn = false;
  let username = null;
  let userid = null;

  if(req.userData) {
    isLoggedIn = true;
    username = req.userData.username;
    userid = req.userData.id;
  }
  else return res.status(500).json({error: 'Not logged in.'});

  let blogId = req.body.blogId;

  Blog.findOne({_id: blogId}, (err, blog) => {
    if(err) return res.status(500).json({error: 'Unable to find blog'});
    if(userid != blog.posted_by) return res.status(500).json({error: 'Dont have permision to delete this post.'});
    else {
      blog.delete((err) => {
        if(err) res.status(500).json({error: err});
        res.redirect('/');
      });
    }
  });
});

router.post('/update', (req, res, next) => {
  let isLoggedIn = false;
  let username = null;
  let userid = null;

  if(req.userData) {
    isLoggedIn = true;
    username = req.userData.username;
    userid = req.userData.id;
  }
  else return res.status(500).json({error: 'Not logged in.'});

  let blogId = req.body.blogId;
  let thingsToUpdate = {
    title: req.body.title,
    body: req.body.body,
  }

  Blog.findOne({_id: blogId}, (err, blog) => {
    if(err) return res.status(500).json({error: err});
    
    if(userid != blog.posted_by) return res.status(500).json({error: 'Dont have permision to update this post.'});
    else {
      blog.update(thingsToUpdate, (err) => {
        if(err) res.status(500).json({error: err});
        res.redirect('/blogs/one/'+blog._id);
      });
    }
  });
});

module.exports = router;