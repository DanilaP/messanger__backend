const User = require("../../models/User");
const helpers = require('../../helpers/Helpers');

class UsersController {
    async myData(req, res) {
        try {
            const user = await helpers.getUserFromToken(req);

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
            const user = await helpers.getUserFromToken(req);
            const friendsInfo = await User.find({ _id: { $in: user.friends } });
            res.status(200).json({message: "Успешное получение данных о друзьях", friends: friendsInfo});
        } 
        catch (error) {
            console.log(error);
            return res.status(400).json("Ошибка получения данных!");
        }   
    }

    async updateWeapons(req, res) {
        try {
            const user = await helpers.getUserFromToken(req);
            const {gun, poison, knife} = req.body;

            await User.updateOne({ _id: user._id }, { $set: { gun: gun, poison: poison, knife: knife} });
            res.status(200).json("Данные успешно изменены");
        }
        catch (error) {
            console.log(error);
            return res.status(400).json("Ошибка получения данных!");
        }
    }

    async updateResourses(req, res) {
        try {
            const user = await helpers.getUserFromToken(req);
            const {rubles, regard, smoke, paper, sugar} = req.body;

            await User.updateOne({ _id: user._id }, { $set: { 
                    rubles: rubles, 
                    regard: regard, 
                    smoke: smoke, 
                    paper: paper,
                    sugar: sugar
                } 
            });
            res.status(200).json("Данные успешно изменены");
        }
        catch (error) {
            console.log(error);
            return res.status(400).json("Ошибка получения данных!");
        }
    }
}

module.exports = new UsersController()