require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const error = require('./middlewares/error');
const winston = require('winston');
require('winston-mongodb');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

const app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR : jwtPrivateKey is not defined');
  process.exit(1);
}

// transports
winston.add(winston.transports.File, { filename: 'logfile.log' });
winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly' });

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to mongoDB', err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
