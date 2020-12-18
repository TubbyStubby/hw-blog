const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

let authenticate = require('./middlewares/auth');

const port = process.env.PORT || 8080;

mongoose.connect(
    'mongodb://localhost:27017/hwblog',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

let Blog = require('./models/Blog');

const app = express();
const publicDir = path.join(__dirname, 'public');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(publicDir));
app.use(cookieParser());
app.use(authenticate);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const homeRoute = require('./routes/home');
const userRoute = require('./routes/users');
const blogRoute = require('./routes/blogs');
const commentRoute = require('./routes/comments');

app.use('/', homeRoute);
app.use('/users', userRoute);
app.use('/blogs', blogRoute);
app.use('/comments', commentRoute);

app.use((req, res, next) => {
    const error = new Error('Looks like you are lost');
    console.log('Something happened at ', req.originalUrl)
    error.status = 404;
    next(error);
});

const server = http.createServer(app);

server.listen(port);