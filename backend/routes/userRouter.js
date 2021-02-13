const router = require('express').Router();
const passport = require('passport');
const controller = require('../controllers/userController');

router.route('/register').post(controller.register);
router.route('/login').post(passport.authenticate('local'), controller.login);
router.route('/logout').get(controller.logout);

module.exports = router;
