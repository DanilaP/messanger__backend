const User = require("../../models/User");
const Dialogs = require("../../models/Dialogs");
const jwt = require('jsonwebtoken');
const helpers = require('../../helpers/Helpers');

class MessagesController {
    async getMyMessages (req, res) {
        try {
            let user = await helpers.getUserFromToken(req);
            let userId = String(user._id);
            let opponentId = req.body.opponentId;

            let userMessages = await Dialogs.aggregate([
                { 
                    $match: {
                        members: {
                            $all: [userId, opponentId],
                        }
                    }
                }
            ]);
            res.status(200).json({message: "Получение списка сообщений прошло успешно", messages: userMessages[0].messages});
        }
        catch (error) {
            res.status(400).json({message: "Ошибка получения списка сообщений!"});
            console.log(error);
        }
    }
    async getMyDialogs (req, res) {
        try {
            let user = await helpers.getUserFromToken(req);
            let userId = String(user._id);
            let usersFromDialogs = [];

            let userDialogs = await Dialogs.aggregate([
                { 
                    $match: {
                        members: {
                            $all: [userId],
                        }
                    }
                }
            ]);

            userDialogs.map((dialog) => {
                dialog.members.map((member) => {
                    if (!usersFromDialogs.includes(member) && (member !== userId)) {
                        usersFromDialogs = [...usersFromDialogs, member];
                    }
                })
            })
            const usersInfo = await User.find({ _id: { $in: usersFromDialogs } }).select("_id name avatar");
            res.status(200).json({message: "Получение списка диалогов прошло успешно", dialogs: usersInfo});
        }
        catch (error) {
            res.status(400).json({message: "Ошибка получения списка диалогов!"});
            console.log(error);
        }
    }
}

module.exports = new MessagesController()