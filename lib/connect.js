// mongoose connection functions
require('dotenv').config('tests/.env')
const dbUri = process.env.MONGO_URI;
const mongoose = require('mongoose');
mongoose.Promise = Promise;


module.exports = function(dbUri) {
  // TODO: close existing connection, if already open...
  const promise = mongoose.connect(dbUri).then(() => mongoose.connection);

  // Successful connection
  mongoose.connection.on('connected', function() {
    console.log('Mongoose default connection open to ' + dbUri);
  });

  // If the connection throws an error
  mongoose.connection.on('error', function() {
    console.log('connection error');
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function() {
    console.log('mongoDB has disconnected');
    mongoose.connect(dbUri).then(() => mongoose.connection);

  });

  // If the node process ends, close the connection
  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      console.log(
        'Mongoose default connection disconnected through app termination'
      );
      process.exit(0);
    });
  });

  return promise;
};
