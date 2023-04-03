const Router = require('express');
const router = new Router();
const controller = require('./filesController');

router.post('/changeFileName', controller.changeFileName);
router.post('/deleteFile', controller.deleteFile);



module.exports = router