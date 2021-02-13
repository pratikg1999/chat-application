const sendResponse = require('../utils/apiOut').sendResponse;

const verifyAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    sendResponse(res, 403, { msg: 'Unauthorized' });
  }
};

module.exports = { verifyAdmin };
