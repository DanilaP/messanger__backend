const Router = require('express');
const router = new Router();
const controller = require('./UsersController');

router.get('/myData', controller.myData);
router.get('/myFriendsData', controller.myFriendsData);
router.post('/updateWeapons', controller.updateWeapons);
router.post('/updateResourses', controller.updateWeapons);

module.exports = router