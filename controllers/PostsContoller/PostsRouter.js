const Router = require('express');
const router = new Router();
const controller = require('./PostsController');

router.post('/createPost', controller.createPost);

module.exports = router