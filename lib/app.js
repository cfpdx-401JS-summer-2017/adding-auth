const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./error-handler');
const ensureAuth = require('./auth/ensure-auth')()
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(morgan('dev'));

const cars = require('./routes/cars-routes');
const users = require('./routes/user-routes');

app.use('/cars', ensureAuth, cars);
app.use('/users', users);

app.use(errorHandler());


module.exports = app;