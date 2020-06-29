const mongoose = require('mongoose');

const birthdaySchema = mongoose.Schema({
    userId: {type: String, required: true},
    serverId: {type: String, required: true},
    pseudo: {type: String, required: true},
    date: {type: String, required: true},
})

module.exports = mongoose.model('Birthday', birthdaySchema);