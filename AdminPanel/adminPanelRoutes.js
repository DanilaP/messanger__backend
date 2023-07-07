const Router = require('express');
const router = new Router();
const controller = require('./adminPanelController');

router.get("/getInfoAboutAllUsers", controller.getInfoAboutAllUsers);
router.get("/clearUserStore", controller.clearUserStore);

module.exports = router