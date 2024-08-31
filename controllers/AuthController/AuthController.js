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
            const { email, password, name } = req.body;
            const isUserExists = await User.find({email});
            
            if (isUserExists.length !== 0) {
                res.status(400).json({message: "Данный пользователь уже существует"})
            }
            else {
                const user = new User({
                    name: name,
                    email: email, 
                    password: password, 
                    friends: [],
                    avatar: "http://localhost:5000/UserAvatars/avatar.jpg",
                    friendRequests: [],
                })
                await user.save();
                const token = generateAccessToken(user._id);
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
                return res.json({message: `Успешный вход`, user: user, token: token});
            }
        }
        catch (error) {
            console.log(error);
            res.status(400).json({message: "Ошибка входа!"});
        }
    }
}

module.exports = new AuthController()