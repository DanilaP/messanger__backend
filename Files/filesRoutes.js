const Router = require('express');
const router = new Router();
const controller = require('./filesController');

router.post('/changeFileName', controller.changeFileName);
router.post('/deleteFile', controller.deleteFile);
router.post('/deleteFolder', controller.deleteFolder);
router.post('/changeFolderName', controller.changeFolderName);

module.exports = router