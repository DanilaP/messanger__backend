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
                folderId: newfiles[indexOfChangedFile].folderId,
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
            const path = "./userAvatars/" + req.body.deletedFilePath.replace('https://backend-danila123.amvera.io/', '');

            let newFilesArray = user.files.filter(element => element.path !== req.body.deletedFilePath);
            await User.updateOne({ _id: userId.id }, { $set: { files: newFilesArray } });
            fs.unlinkSync(path);
            //fs.rmdir(path, {recursive: true}, (err) => console.log(err));

            res.status(200).json({message: "File was deleted succesfull", files: newFilesArray})
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: "Error!"});
        }
    }
    async deleteFolder(req, res) {
        try {
            const token = req.headers.authorization;     
            const userId = jwt_decode(token);
            const user = await User.findOne({_id: userId.id});

            let arr = [req.body.folderId];
            user.folders.map(el => {
                if (arr.includes(el.parentFolderId)) {
                    arr = [...arr, el.folderId];
                }
            })
            let newFoldersArray = user.folders.filter(el => !arr.includes(el.folderId));
            let newFilesArray = user.files.filter(el => !arr.includes(el.folderId));

            user.files.map((el) => {
                if (arr.includes(el.folderId)) {
                    const path = "./userAvatars/" + el.path.replace('https://backend-danila123.amvera.io/', '');
                    fs.unlinkSync(path);
                }
            })
            
            await User.updateOne({ _id: userId.id }, { $set: { folders: newFoldersArray, files: newFilesArray } });
            res.status(200).json({
                message: "Folder was deleted succesfull", 
                folders: newFoldersArray.filter(el => el.parentFolderId === req.body.parentFolderId),
                files: newFilesArray
            })
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: "Error!"});
        }
    }
    async changeFolderName(req, res) {
        try {
            const token = req.headers.authorization;     
            const userId = jwt_decode(token);
            const user = await User.findOne({_id: userId.id});

            const userFolders = user.folders.filter(e => e.folderId !== req.body.folderIndex)
            const newFolder = user.folders.filter(e => e.folderId == req.body.folderIndex);
            newFolder[0].folderName = req.body.folderName;
            const newFoldersArray = [...userFolders, newFolder[0]];
            await User.updateOne({ _id: userId.id }, { $set: { folders: newFoldersArray} });

            res.json({message: "Sucessfull!", folders: newFoldersArray});
        } 
        catch (e) {
            console.log(e);
            res.status(400).json({message: "Could not change folder name!"})
        }
    }
}
module.exports = new profileController()