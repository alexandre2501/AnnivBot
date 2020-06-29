const mongoose = require('mongoose');

const birthdayChannelSchema = mongoose.Schema({
    serverId: {type: String, required: true},
    channelId: {type: String},
})

module.exports = mongoose.model('BirthdayChannel', birthdayChannelSchema);