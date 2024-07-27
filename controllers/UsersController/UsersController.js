const User = require("../../models/User");
const jwt_decode = require('jwt-decode')
const jwt = require('jsonwebtoken');

class UsersController {

    async myData(req, res) {

        try {
            const token = req.headers.authorization;     
            const userId = jwt_decode(token);
            let user = await User.findOne({_id: userId.id});

            if (user) {
                return res.status(200).json({message: "Данные успешно получены", user: user});
            }
            else {
                return res.status(400).json("Ошибка получения данных!");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(400).json("Ошибка получения данных!");
        }
    }

    async myFriendsData(req, res) {
        try {
            const token = req.headers.authorization;     
            const userId = jwt_decode(token);
            let user = await User.findOne({_id: userId.id});

            const friendsInfo = await User.find({ _id: { $in: user.friends } });

            res.status(200).json({message: "Успешное получение данных о друзьях", friends: friendsInfo});

        } 
        catch (error) {
            console.log(error);
            return res.status(400).json("Ошибка получения данных!");
        }   
    }
}

module.exports = new UsersController()