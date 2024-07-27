const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const User = require("./models/User");
const jwt_decode = require('jwt-decode');
const fs = require('fs');
const authRouter = require('./controllers/AuthController/AuthRouter');
const usersRouter = require('./controllers/UsersController/UsersRouter');

const PORT = 5000;
const BD_URL = `mongodb+srv://danila:355473288@cluster0.ag5ij.mongodb.net/prisonDataBase?retryWrites=true&w=majority`;
const app = express();
app.use(cors({origin: '*'}));
mongoose.set('strictQuery', false);

app.use(fileUpload())
app.use(express.json());
app.use(express.static('./userAvatars'));
app.use('/auth', authRouter);
app.use('/users', usersRouter);

async function startApp() {
    try {
        await mongoose.connect(BD_URL);
        app.listen(PORT, () => console.log('Server started at PORT' + " " + PORT));
    } catch (error) {
        console.log(error);
    }
}
startApp();
