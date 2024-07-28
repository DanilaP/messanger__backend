const Router = require('express');
const router = new Router();
const controller = require('./AdminController');

router.post('/addBoss', controller.addBoss);

module.exports = router