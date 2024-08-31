const {model, Schema} = require('mongoose');

const Dialogs = new Schema({
    id: {type: Number},
    members: {type: Array},
    messages: {type: Array},
})

module.exports = model('Dialogs', Dialogs)