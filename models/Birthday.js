const mongoose = require('mongoose');

const birthdaySchema = mongoose.Schema({
    userId: {type: Number, required: true},
    serverId: {type: Number, required: true},
    pseudo: {type: String, required: true},
    date: {type: String, required: true},
})

module.exports = mongoose.model('Birthday', birthdaySchema);