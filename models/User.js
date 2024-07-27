const {model, Schema} = require('mongoose');

const User = new Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    regard: {type: Number},
    paper: {type: Number},
    rubles: {type: Number},
    smoke: {type: Number},
    friends: {type: Array},
    sugar: {type: Number},
})

module.exports = model('User', User)