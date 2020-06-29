const BirthdayChannel = require('../models/BirthdayChannel');

const birthdayCtrl = require('../controllers/birthday');

exports.register = (message) => {
    BirthdayChannel.countDocuments({serverId: message.channel.guild.id})
        .then(count => {
            message.reply(message.channel.id + ' / ' + message.channel.guild.id)
            if(count === 0){
                const birthdayChannel = new BirthdayChannel({
                    serverId: message.channel.guild.id,
                    channelId: message.channel.id,
                });
                birthdayChannel.save()
                    .then(() => {message.reply('Les anniversaires seront maintenant souhaités dans ce salon.')})
                    .catch(error => {console.log('erreur')});
            }
            else{
                BirthdayChannel.updateOne({serverId: message.channel.guild.id}, {channelId: message.channel.id})
                    .then(() => {message.reply('Les anniversaires seront maintenant souhaités dans ce salon.')})
                    .catch(error => {console.log('erreur')})
            }
        })
        .catch(error => {console.log('erreur')});
}

exports.getRegisteredChannel = (bot, serverId, date) => {
    BirthdayChannel.countDocuments({serverId : serverId})
        .then(count => {
            if(count > 0){
                BirthdayChannel.findOne({serverId: serverId}, function(err, res){
                    birthdayCtrl.listTodayServerBirthday(bot, serverId, date, res.channelId)
                })
            }
            else{
                birthdayCtrl.listTodayServerBirthday(bot, serverId, date, false)
            }
        })
        .catch()
}

exports.dump = (message) => {
    BirthdayChannel.find({serverId: message.channel.guild.id})
        .then(channels => {console.log(channels)})
        .catch()
}

