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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cookieParser());
app.use(authenticate);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let homeRoute = require('./routes/home');
let userRoute = require('./routes/users');

app.use('/', homeRoute);
app.use('/users', userRoute);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

const server = http.createServer(app);

server.listen(port);