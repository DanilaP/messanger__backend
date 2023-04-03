const Router = require('express');
const router = new Router();
const controller = require('./ProfileController');

router.post('/changeUserPassword', controller.changeUserPassword);
router.post('/changeUserSecretCode', controller.changeUserSecretCode);
router.post('/getUserDataById', controller.getUserDataById);
module.exports = router