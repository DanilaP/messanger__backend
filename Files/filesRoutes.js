const Router = require('express');
const router = new Router();
const controller = require('./filesController');

router.post('/changeFileName', controller.changeFileName);
router.post('/deleteFile', controller.deleteFile);
router.post('/deleteFolder', controller.deleteFolder);
router.post('/changeFolderName', controller.changeFolderName);
router.post('/changeFileStatus', controller.changeFileStatus);
router.post('/recoverUserFile', controller.recoverUserFile);
router.post('/deleteFileFromBacket', controller.deleteFileFromBacket);
router.post('/moveFolderToBacket', controller.moveFolderToBacket);
router.post('/recoverFolderFromBacket', controller.recoverFolderFromBacket);

module.exports = router