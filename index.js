const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const authRouter = require('./controllers/AuthController/AuthRouter');
const usersRouter = require('./controllers/UsersController/UsersRouter');
const messagesRouter = require('./controllers/MessagesController/MessagesRouter');
const postsRouter = require('./controllers/PostsContoller/PostsRouter');
const http = require('http');
const WebSocket = require('ws');
const jwt_decode = require('jwt-decode');
const User = require("./models/User");
const Dialogs = require("./models/Dialogs");
const bodyParser = require('body-parser');

const PORT = 5000;
const BD_URL = `mongodb+srv://danila:355473288@cluster0.ag5ij.mongodb.net/prisonDataBase?retryWrites=true&w=majority`;
const app = express();
const server = http.createServer(app);

app.use(cors({origin: '*'}));
mongoose.set('strictQuery', false);

app.use(fileUpload())
app.use(express.json());
app.use(express.static('./staticFiles'));
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.use('/posts', postsRouter);

const wss = new WebSocket.Server({ server });
let clients = [];

wss.on('connection', (ws) => {
    clients = [...clients, {userws: ws, userId: jwt_decode(ws.protocol).id}];

    ws.on('message', async (message) => {
        try {
            const newMessageData = JSON.parse(message);
            const senderId = jwt_decode(newMessageData.senderToken).id;
            const recipientId = newMessageData.recipientId;
            
            let isDialogExists = await Dialogs.aggregate([
                { 
                    $match: {
                        members: {
                            $all: [senderId, recipientId],
                        }
                    }
                }
            ]);
            if (isDialogExists.length > 0) {
                let currentDialog = isDialogExists[0];
                await Dialogs.updateOne({ id: currentDialog.id }, { $set: { 
                        messages: [...currentDialog.messages, {
                            senderId: senderId,
                            recipientId: recipientId,
                            message: newMessageData.message,
                        }] 
                    } 
                });
            } 
            else {
                const dialog = new Dialogs({
                    id: Date.now(),
                    members: [senderId, recipientId],
                    messages: [{
                        senderId: senderId,
                        recipientId: recipientId,
                        message: newMessageData.message,
                    }]
                })
                await dialog.save();
            }
            
            clients.map((client) => {
                if (client.userId === recipientId || client.userId === senderId) {
                    client.userws.send(JSON.stringify([...isDialogExists[0].messages, {
                        senderId: senderId,
                        recipientId: recipientId,
                        message: newMessageData.message,
                    }]));
                }
            })
        } 
        catch (error) {
            console.log(error);
        }
    });

    ws.on('close', () => {
        console.log("Соединение закрыто!")
    });
});

async function startApp() {
    try {
        await mongoose.connect(BD_URL);
        server.listen(PORT, () => console.log('Server started at PORT' + " " + PORT));
    } catch (error) {
        console.log(error);
    }
}
startApp();
