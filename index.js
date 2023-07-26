const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRoutes');
const profileRouter = require('./Profile/profileRoutes');
const filesRouter = require('./Files/filesRoutes');
const adminRouter = require('./AdminPanel/adminPanelRoutes');
const fileUpload = require('express-fileupload');
const User = require("./models/User");
const jwt_decode = require('jwt-decode');
const fs = require('fs');

const PORT = 5000;
const BD_URL = `mongodb+srv://danila:355473288@cluster0.ag5ij.mongodb.net/?retryWrites=true&w=majority`;
const app = express();
app.use(cors({origin: '*'}));
mongoose.set('strictQuery', false);

/*var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}*/


app.use(fileUpload())
app.use(express.json());
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/files', filesRouter);
app.use('/admin', adminRouter);
app.use(express.static('./userAvatars'));


app.post("/test", cors(), async function(req, res) {
    res.status(200).json({message: "Hello world!"});
});
app.post("/upload", async function (req, res) {
    if (req.files && Object.keys(req.files).length !== 0) {

        const token = req.headers.authorization;     
        const userId = jwt_decode(token);
        let isEmpty = await User.findOne({_id: userId.id});

        const uploadedFile = req.files.uploadFile;
        const uploadPath = __dirname + "/userAvatars/" + isEmpty.userLogin + "_" + uploadedFile.name;
        await User.updateOne({ _id: isEmpty._id }, { $set: { avatar: "https://backend-danila123.amvera.io/" + isEmpty.userLogin + "_" + uploadedFile.name } });

        uploadedFile.mv(uploadPath, function (err) {
            if (err) {
                console.log(err);
                res.send("Failed !!");
            } 
            else res.json({message: "Successfully Uploaded !!", avatar: "https://backend-danila123.amvera.io/" + isEmpty.userLogin + "_" + uploadedFile.name});
        });
    } 
    else res.send("No file uploaded !!");
});
app.post("/uploadFiles", async function (req, res) {
    if (req.files && Object.keys(req.files).length !== 0) {

        const token = req.headers.authorization;     
        const userId = jwt_decode(token);
        let isEmpty = await User.findOne({_id: userId.id});

        const folderId = Number(req.body.folderId);
        const uploadedFile = req.files.uploadFile;
        const uploadPath = __dirname + "/userAvatars/userFiles/" + isEmpty.userLogin + "_" + uploadedFile.name; 
        const obj = {
            path: "https://backend-danila123.amvera.io/userFiles/" + isEmpty.userLogin + "_" + uploadedFile.name,
            fileName: uploadedFile.name,
            size: (uploadedFile.size/1048576).toFixed(2),
            type: uploadedFile.mimetype,
            folderId: folderId,
        }
        
        if (fs.existsSync(uploadPath)) {
            res.status(400).json({message: "Данный файл уже существует в вашем хранилище"});
        }
        else {
            await User.updateOne({ _id: isEmpty._id }, { $set: { files: [...isEmpty.files, obj]} 
            });
    
            uploadedFile.mv(uploadPath, function (err) {
                if (err) {
                    console.log(err);
                    res.send("Failed !!");
                } 
                else res.json({message: "Succesfully uploaded!", files: [...isEmpty.files, obj]});
            });
        }
        
    } 
    else res.send("No file uploaded !!");
});
app.post("/createFolder", async function (req, res) {
    const token = req.headers.authorization;     
    const userId = jwt_decode(token);
    let currentUser = await User.findOne({_id: userId.id});

    try {
        await User.updateOne({ _id: currentUser._id }, { $set: { folders: [...currentUser.folders, {
            folderName: req.body.folderName,
            folderId: currentUser.folders.length + 1,
            parentFolderId: req.body.parentFolderId,
        }]}});
        currentUser.folders = [...currentUser.folders, {
            folderName: req.body.folderName,
            folderId: currentUser.folders.length + 1,
            parentFolderId: req.body.parentFolderId,
        }]
        res.status(200).json({
            message: "Folder created sucessfull", 
            folders: currentUser.folders.filter(el => el.parentFolderId === req.body.parentFolderId)
        })
    } catch (err) {
        console.log(err);
    }
});
app.post("/getFilesFromFolder", async function(req, res) {
    const token = req.headers.authorization;     
    const userId = jwt_decode(token);
    let currentUser = await User.findOne({_id: userId.id});

    let newFiles = currentUser.files.filter(el => el.folderId === req.body.folderId);
    let newFolders = currentUser.folders.filter(el => el.parentFolderId === req.body.folderId);

    res.status(200).json({message: "Getting file sucessfull", folders: newFolders, files: newFiles});
});
async function startApp() {
    try {
        await mongoose.connect(BD_URL);
        app.listen(PORT, () => console.log('Server started at PORT' + " " + PORT));
    } catch (error) {
        console.log(error);
    }
}
startApp();
