const jwt_decode = require('jwt-decode');
const User = require("../models/User");

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
  
module.exports = { getUserFromToken };