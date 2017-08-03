const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./error-handler');
const createAuth = require('./auth/ensure-auth');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('public'));
const ensureAuth = createAuth();

const auth = require('./routes/auth');
const dragons = require('./routes/dragons');
app.use('/api/auth', auth);
app.use('/dragons', ensureAuth, dragons);




app.use(errorHandler());

module.exports = app;