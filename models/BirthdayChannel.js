const mongoose = require('mongoose');

const birthdayChannelSchema = mongoose.Schema({
    serverId: {type: Number, required: true},
    channelId: {type: Number},
})

module.exports = mongoose.model('BirthdayChannel', birthdayChannelSchema);