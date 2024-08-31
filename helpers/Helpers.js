const jwt_decode = require('jwt-decode');
const User = require("../models/User");

async function getUserFromToken(req) {
    const token = req.headers.authorization;    
    const userId = jwt_decode(token);
    let user = await User.findOne({_id: userId.id});

    return user;
}
  
module.exports = { getUserFromToken };