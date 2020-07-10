// Wrapper to catch errors on every handler, to avoid to write try/catch block all the time
// This wrapper must return a reference on callback function to Express with arguments (req, res, next)
// Also he takes in parameter the async handler
module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};
