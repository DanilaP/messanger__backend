const Router = require('express');
const router = new Router();
const controller = require('./UsersController');

router.get('/myData', controller.myData);
router.get('/myFriendsData', controller.myFriendsData);

module.exports = router