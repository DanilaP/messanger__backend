const {model, Schema} = require('mongoose');

const Boss = new Schema({
    name: {type: String, unique: true, required: true},
    hp: {type: Number, required: true},
    rublesRewards: {type: Number},
    regardRewards: {type: Number},
    smokeRewards: {type: Number},
    mainAvatar: {type: String, unique: true, required: true},
    stages: {type: Array}, //hp: number, stageAvatar: string
})

module.exports = model('Boss', Boss)