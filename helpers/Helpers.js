const jwt_decode = require('jwt-decode');
const User = require("../models/User");
const jwt = require('jsonwebtoken');

async function getUserFromToken(req) {
    try {
        const token = req.headers.authorization;    
        const userId = jwt_decode(token);
        let user = await User.findOne({_id: userId.id});
    
        return user;
    } catch (error) {
        console.log(error);
        return "Ошибка при получении объекта пользователя!"
    }
}
function generateAccessToken(id) {
    const payload = {
        id: id,
    }
    const token = jwt.sign(payload, "SECRET_KEY_RANDOM", {expiresIn: "24h"});
    return token;
}

module.exports = { getUserFromToken, generateAccessToken };