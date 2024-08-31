const Router = require('express');
const router = new Router();
const controller = require('./MessagesController');

router.post('/getMyMessages', controller.getMyMessages);
router.get('/getMyDialogs', controller.getMyDialogs);

module.exports = router