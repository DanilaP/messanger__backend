const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRoutes');
const profileRouter = require('./Profile/profileRoutes');
const filesRouter = require('./Files/filesRoutes');
const fileUpload = require('express-fileupload')
const User = require("./models/User")
const jwt_decode = require('jwt-decode')
const fs = require('fs');
const sql = require("mssql/msnodesqlv8");

const PORT = 5000;
const BD_URL = `mongodb+srv://danila:355473288@cluster0.ag5ij.mongodb.net/?retryWrites=true&w=majority`;
const app = express();
mongoose.set('strictQuery', false);

app.use(fileUpload())
app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/files', filesRouter);
app.use(express.static('./userAvatars'));


app.post("/upload", async function (req, res) {
    if (req.files && Object.keys(req.files).length !== 0) {

        const token = req.headers.authorization;     
        const userId = jwt_decode(token);
        let isEmpty = await User.findOne({_id: userId.id});

        const uploadedFile = req.files.uploadFile;
        const uploadPath = __dirname + "/userAvatars/" + isEmpty.userLogin + "_" + uploadedFile.name;
        await User.updateOne({ _id: isEmpty._id }, { $set: { avatar: "http://localhost:5000/" + isEmpty.userLogin + "_" + uploadedFile.name } });

        uploadedFile.mv(uploadPath, function (err) {
            if (err) {
                console.log(err);
                res.send("Failed !!");
            } 
            else res.json({message: "Successfully Uploaded !!", avatar: "http://localhost:5000/" + isEmpty.userLogin + "_" + uploadedFile.name});
        });
    } 
    else res.send("No file uploaded !!");
});

app.post("/uploadFiles", async function (req, res) {
    if (req.files && Object.keys(req.files).length !== 0) {

        const token = req.headers.authorization;     
        const userId = jwt_decode(token);
        let isEmpty = await User.findOne({_id: userId.id});

        const uploadedFile = req.files.uploadFile;  
        const uploadPath = __dirname + "/userAvatars/userFiles/" + isEmpty.userLogin + "_" + uploadedFile.name;
        const obj = {
            path: "http://localhost:5000/userFiles/" + isEmpty.userLogin + "_" + uploadedFile.name,
            fileName: uploadedFile.name,
            size: (uploadedFile.size/1048576).toFixed(2),
            type: uploadedFile.mimetype,
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

async function startApp() {
    try {
        await mongoose.connect(BD_URL);
        
        /*let config = {
            server: "DESKTOP-919QSJB\\SQLEXPRESS03",
            database: "databaza1",
            driver: "msnodesqlv8", 
            options: {
                trustedConnection: true
            }
        }
        sql.connect(config, (err) => {
            if (err) {
                console.log(err)
            }
            else {
                let req = new sql.Request();
                req.query("select * from dbo.Citizen", (err, records) => {
                    console.log(records);
                })
            }
        })
        */
        app.listen(PORT, () => console.log('Server started at PORT' + " " + PORT));
    } catch (error) {
        console.log(error);
    }
}
startApp();
