const winston = require('winston');
require('winston-mongodb');
require('express-async-errors'); // wrapper express handler to catch async errors

module.exports = function () {
  // to log uncaught exceptions
  // rem : node process is ended (best practice to clean internal state)
  // It will have to be restart from process manager in production
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

  // to manage unhandle promise rejection
  process.on('unhandledRejection', ex => {
    throw ex; // throw to winston.handleExceptions
  });

  // transports
  winston.add(winston.transports.File, { filename: 'logfile.log' });
  winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly' });
};
