const {model, Schema} = require('mongoose');

const User = new Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    friends: {type: Array},
    avatar: {type: String},
    friendRequests: {type: Array},
})

module.exports = model('User', User)