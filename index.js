const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const port = process.env.PORT || 8080;

mongoose.connect(
    'mongodb://localhost:27017/',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.render('index', {
        heading: 'Home',
    })
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

const server = http.createServer(app);

server.listen(port);