const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const authRouter = require('./controllers/AuthController/AuthRouter');
const usersRouter = require('./controllers/UsersController/UsersRouter');
const adminRouter = require('./controllers/AdminController/AdminRouter');

const PORT = 5000;
const BD_URL = `mongodb+srv://danila:355473288@cluster0.ag5ij.mongodb.net/prisonDataBase?retryWrites=true&w=majority`;
const app = express();
app.use(cors({origin: '*'}));
mongoose.set('strictQuery', false);

app.use(fileUpload())
app.use(express.json());
app.use(express.static('./staticFiles'));

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

async function startApp() {
    try {
        await mongoose.connect(BD_URL);
        app.listen(PORT, () => console.log('Server started at PORT' + " " + PORT));
    } catch (error) {
        console.log(error);
    }
}
startApp();
