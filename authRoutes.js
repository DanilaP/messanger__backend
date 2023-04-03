const Router = require('express');
const router = new Router();
const controller = require('./authController');

router.post('/registration', controller.registration);
router.post('/login', controller.login);
router.get('/users', controller.users);
router.get('/getUserData', controller.getUserData);
router.post('/changeUserBalance', controller.changeUserBalance);

module.exports = router