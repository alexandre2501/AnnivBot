const BirthdayChannel = require('../models/BirthdayChannel');

exports.register = (message) => {
    BirthdayChannel.countDocuments({serverId: message.channel.guild.id})
        .then(count => {
            console.log(count)
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

exports.dump = (message) => {
    BirthdayChannel.find({serverId: message.channel.guild.id})
        .then(channels => {console.log(channels)})
        .catch()
}

