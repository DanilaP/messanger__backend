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
                status: newfiles[indexOfChangedFile].status,
                date: newfiles[indexOfChangedFile].date
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

            let newBacketArray = user.backet;
            let deletedUserFile = user.files.filter(el => el.path == req.body.deletedFilePath);
            newBacketArray = [...newBacketArray, deletedUserFile[0]];

            if (newBacketArray.length > 10) {
                let firstElement = newBacketArray.shift();
                const deletedPath = "./userAvatars/" + firstElement.path.replace('http://localhost:5000/', '');
                fs.unlinkSync(deletedPath);
            }

            await User.updateOne({ _id: userId.id }, { $set: { files: newFilesArray, backet: newBacketArray } });
            
            //fs.rmdir(path, {recursive: true}, (err) => console.log(err));

            res.status(200).json({message: "File was deleted succesfull", files: newFilesArray, backet: newBacketArray})
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
            let newUserBacket = user.backet.filter(el => !el.folderId == req.body.folderId);
            
            user.files.map((el) => {
                if (arr.includes(el.folderId)) {
                    const path = "./userAvatars/" + el.path.replace('http://localhost:5000/', '');
                    fs.unlinkSync(path);
                }
            })
    
            await User.updateOne({ _id: userId.id }, { $set: { 
                folders: newFoldersArray, 
                files: newFilesArray, 
                backet: newUserBacket } 
            });
            res.status(200).json({
                message: "Folder was deleted succesfull", 
                folders: newFoldersArray.filter(el => el.parentFolderId === req.body.parentFolderId),
                files: newFilesArray,
                backet: newUserBacket
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
    async changeFileStatus(req, res) {
        try {
            const token = req.headers.authorization;     
            const userId = jwt_decode(token);
            const user = await User.findOne({_id: userId.id});
            
            const newfiles = user.files;
            const newFile = req.body.file;
            let indexOfChangedFile = newfiles.findIndex(el => el.path == newFile.path);
            newfiles[indexOfChangedFile] = newFile;

            await User.updateOne({ _id: userId.id }, { $set: { files: newfiles } });

            res.json({message: "Sucessfull!", files: newfiles})
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: "Error!"});
        }
    }
    async recoverUserFile(req, res) {
        try {
            const token = req.headers.authorization;     
            const userId = jwt_decode(token);
            const user = await User.findOne({_id: userId.id});
    
            let newUserFiles = user.files;
            newUserFiles = [...newUserFiles, req.body.file];
            let newUserBacket = user.backet.filter((el) => el.path !== req.body.file.path);

            await User.updateOne({ _id: userId.id }, { $set: { files: newUserFiles, backet: newUserBacket } });
    
            res.status(200).json({message: "Sucessfully recovered!", files: newUserFiles, backet: newUserBacket});
        }
        catch (error) {
            res.status(200).json({message: "Error!"})
            console.log(error);
        }
    }
    async deleteFileFromBacket(req, res) {
        try {
            const token = req.headers.authorization;     
            const userId = jwt_decode(token);
            const user = await User.findOne({_id: userId.id});

            let newBacket = user.backet.filter((el) => el.path !== req.body.file.path);
            const path = "./userAvatars/" + req.body.file.path.replace('http://localhost:5000/', '');
            fs.unlinkSync(path);

            await User.updateOne({ _id: userId.id }, { $set: { backet: newBacket } });
            res.status(200).json({message: "Sucessfully deleted!", backet: newBacket});
        }
        catch (error) {
            res.status(200).json({message: "Error!"});
            console.log(error);
        }
    }
    async moveFolderToBacket(req, res) {
        try {
            const token = req.headers.authorization;     
            const userId = jwt_decode(token);
            const user = await User.findOne({_id: userId.id});
    
            let newBacketArray = user.backet;
            let deletedFolder = req.body.folder;
            deletedFolder.isDeleted = true;
            newBacketArray = [...newBacketArray, deletedFolder];
            
            let newFoldersArray = user.folders.filter(el => el.folderId !== deletedFolder.folderId);
            newFoldersArray = [...newFoldersArray, deletedFolder];
            
            
            
            await User.updateOne({ _id: userId.id }, { $set: 
                { 
                folders: newFoldersArray, 
                backet: newBacketArray 
                } 
            }); 
  
            res.status(200).json({
                message: "Folder now in your backet", 
                folders: newFoldersArray.filter(el => el.parentFolderId === req.body.parentFolderId),
                backet: newBacketArray
            })
        } 
        catch (error) {
            res.status(400).json({
                message: "Error!", 
            })
        }
    }
    async recoverFolderFromBacket(req, res) {
        try {
            const token = req.headers.authorization;     
            const userId = jwt_decode(token);
            const user = await User.findOne({_id: userId.id});
            
            let folderForRecovering = req.body.folder;
            folderForRecovering.isDeleted = false;

            let newFoldersArray = user.folders.filter(el => el.folderId !== folderForRecovering.folderId);
            newFoldersArray = [...newFoldersArray, folderForRecovering];

            let newBacketArray = user.backet.filter(el => el.folderId !== folderForRecovering.folderId);

            await User.updateOne({ _id: userId.id }, { $set: { 
                folders: newFoldersArray, 
                backet: newBacketArray 
                } 
            });
            res.status(200).json({message: "folderSuccessfully recovered!", backet: newBacketArray});
        }
        catch (error) {
            res.status(400).json({message: "Error!"});
            console.log(error);
        }

    }
    
}
module.exports = new profileController()