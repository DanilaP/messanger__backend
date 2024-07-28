const User = require("../../models/User");
const jwt = require('jsonwebtoken');

const generateAccessToken = (id) => {
    const payload = {
        id: id,
    }
    return jwt.sign(payload, "SECRET_KEY_RANDOM", {expiresIn: "24h"});
}

class AuthController {

    async registration(req, res) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const isUserExists = await User.find({email});
            
            if (isUserExists.length !== 0) {
                res.status(400).json({message: "Данный пользователь уже существует"})
            }
            else {
                const user = {
                    name: "Прибывший зек",
                    email: email, 
                    password: password, 
                    regard: 0,
                    paper: 0,
                    rubles: 0,
                    smoke: 0,
                    friends: [],
                    sugar: 0,
                    gun: 0,
                    poison: 0,
                    knife: 0,
                }
                const token = generateAccessToken(user._id);
                await User.create(user);
                res.json({message: "Регистрация прошла успешно", user: user, token: token});
            }
        }
        catch (error) {
            console.log(error);
            res.status(400).json({message: "Ошибка регистрации"});
        }
    }

    async login(req, res) {
        try {
            const userEmail = req.body.email;
            const userPassword = req.body.password;
            const user = await User.findOne({email: userEmail});

            if (user === null) {
                return res.status(400).json({message: `Пользователь ${userEmail} не найден`});
            }

            if (userPassword !== user.password) {
                return res.status(400).json({message: `Неправильный пароль!`});
            } else {
                const token = generateAccessToken(user._id);
                return res.json({message: `Успешный вход`, user: user, authToken: token});
            }
        }
        catch (error) {
            console.log(error);
            res.status(400).json({message: "Ошибка входа!"});
        }
    }
}

module.exports = new AuthController()