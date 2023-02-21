const mongoose = require('mongoose');
const models = require('./models');

const connectionString = 'mongodb://localhost:27017/taller-db';

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);
mongoose.connect(connectionString, { autoIndex: true });

mongoose.connection.on('connected', function () {
  console.log('MongoDB connection is open.');
});

mongoose.connection.on('error', function (err) {
  console.log(`MongoDB connection has occured ${err} error`);
});

mongoose.connection.on('disconnected', function () {
  console.log('MongoDB connection is disconnected ');
});

// (async () => {
//   const employees = await models.Employee.find({});
//   console.log('employees', employees);
// })();
