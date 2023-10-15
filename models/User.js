const {model, Schema} = require('mongoose');

const User = new Schema({
    userLogin: {type: String, unique: true, required: true},
    userPassword: {type: String, required: true},
    balance: {type: Number, required: true},
    avatar: {type: String, unique: false, required: true},
    files: {type: Array},
    secretAccessCode: {type: String},
    folders: {type: Array},
    backet: {type: Array}
})

module.exports = model('User', User)