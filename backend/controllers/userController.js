const dbUtils = require('../utils/dbUtils');
const sendResponse = require('../utils/apiOut').sendResponse;

const register = async (req, res, next) => {
  const callback = (err, user) => {
    if (err) next(err);
    else sendResponse(res, 200, user);
  };
  try {
    req.body.avatar = 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 30 + Math.random() * 30).toString();
    await dbUtils.register(req.body, req.body.password, callback);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  return sendResponse(res, 200, { success: true, status: 'You are successfully logged in!', user: req.user });
};

const logout = (req, res, next) => {
  if (req.session) {
    console.log(req.session);
    req.logOut();
    sendResponse(res, 200, { success: true, status: 'You are successfully logged out!' });
  } else {
    next(new Error('You are not logged in!'));
  }
};

module.exports = {
  register,
  login,
  logout,
};
