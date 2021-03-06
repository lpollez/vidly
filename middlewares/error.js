const winston = require('winston');

// middleware to manage errors in Express processing pipeline (only)
module.exports = function (err, req, res) {
  winston.error(err.message, err);
  res.status(500).send('Something failed');
};
