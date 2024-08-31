const Router = require('express');
const router = new Router();
const controller = require('./UsersController');

router.get('/myData', controller.myData);
router.get('/myFriendsData', controller.myFriendsData);
router.post('/guestFriendsData', controller.guestFriendsData);
router.get('/', controller.getAllUsersData);
router.post('/changeAvatar', controller.changeAvatar);
router.post('/sendFriendRequest', controller.sendFriendRequest);
router.post('/acceptFriendRequest', controller.acceptFriendRequest);
router.post('/declineFriendRequest', controller.declineFriendRequest);
router.post('/getDataById', controller.getDataById);
router.post('/deleteFriend', controller.deleteFriend);

module.exports = router