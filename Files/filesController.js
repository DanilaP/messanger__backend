const User = require("../models/User")
const jwt_decode = require('jwt-decode')
const fs = require('fs');

class profileController {
    async changeFileName(req, res) {
        try {
            const token = req.headers.authorization;     
            const userId = jwt_decode(token);
            const user = await User.findOne({_id: userId.id});
            
            const newfiles = user.files;
            const fileName = req.body.fileName;
            let indexOfChangedFile = newfiles.findIndex(el => el.fileName == fileName);
            newfiles[indexOfChangedFile] = {
                path: newfiles[indexOfChangedFile].path, 
                fileName: req.body.newName, 
                size: newfiles[indexOfChangedFile].size,
                type: newfiles[indexOfChangedFile].type,
            };

            await User.updateOne({ _id: userId.id }, { $set: { files: newfiles } });

            res.json({message: "Sucessfull!", files: newfiles})
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: "Error!"});
        }
    }
    async deleteFile(req, res) {
        try {
            const token = req.headers.authorization;     
            const userId = jwt_decode(token);
            const user = await User.findOne({_id: userId.id});
            const path = "./userAvatars/" + req.body.deletedFilePath.replace('http://localhost:5000/', '');

            let newFilesArray = user.files.filter(element => element.path !== req.body.deletedFilePath);
            await User.updateOne({ _id: userId.id }, { $set: { files: newFilesArray } });
            fs.unlinkSync(path);

            res.status(200).json({message: "File was deleted succesfull", files: newFilesArray})
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: "Error!"});
        }
    }
}
module.exports = new profileController()