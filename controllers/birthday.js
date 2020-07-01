const Birthday = require('../models/Birthday');
const birthdayChannelCtrl = require('../controllers/birthdayChannel');

const normalizeDate = require('../middleware/normalizeDate');

exports.createBirthday = (message, pseudo, date) => {
    //delete req.body._id;
    date = normalizeDate.normalize(date);
    const birthday = new Birthday({
        userId: message.author.id,
        serverId: message.channel.guild.id,
        pseudo: pseudo,
        date: date,
    });
    birthday.save()
        .then(() => {message.reply('L\'anniversaire de ' + pseudo + ' a bien été ajouté pour le ' + date + '.')})
        .catch(error => {console.log('erreur')});
}

exports.modifyBirthday = (message, pseudo, date) => {
    date = normalizeDate.normalize(date);
    Birthday.updateOne({ serverId: message.channel.guild.id, pseudo: pseudo}, {date: date})
        .then(birthday => {message.reply('L\'anniversaire de ' + pseudo + ' a été changé !')})
        .catch(error => {message.reply('Une erreur est survenue')})
}

exports.deleteBirthday = (message, pseudo) => {
    Birthday.countDocuments({serverId: message.channel.guild.id, pseudo: pseudo})
        .then(count => {
            if(count > 0){
                Birthday.deleteOne({serverId: message.channel.guild.id, pseudo: pseudo})
                    .then(birthday => {message.reply('L\'anniversaire de ' + pseudo + ' à été supprimé :( !')})
                    .catch(error => {message.reply('Une erreur est survenue')})
            }
            else{
                message.reply('Cet utilisateur n\'a pas encore entré d\'anniversaire ou n\'existe pas.');
            }
        })
        .catch(error => {message.reply('Une erreur est survenue')});
}

exports.listOneBirthday = (message, pseudo) => {
    Birthday.findOne({ serverId: message.channel.guild.id, pseudo: pseudo})
        .then(birthday => {message.reply('L\'anniversaire de cet utilisateur est le ' + birthday.date + '.')})
        .catch(error => {
            Birthday.countDocuments({serverId: message.channel.guild.id, pseudo: pseudo})
                .then(count => {
                    if(count > 0){
                        message.reply('Une erreur est survenue.');
                    }
                    else{
                        message.reply('Cet utilisateur n\'a pas encore entré d\'anniversaire ou n\'existe pas.');
                    }
                })
                .catch(error => {message.reply('Une erreur est survenue')});
        })
}

exports.listAllBirthday = (message) => {
    Birthday.find({ serverId: message.channel.guild.id})
        .then(birthdays => {
            let str = '';
            for(birthday of birthdays){
                str += birthday.pseudo + ' : ' + birthday.date + ' | ';
            }
            message.reply(str);
        })
        .catch(error => {message.reply('Une erreur est survenue')})
}

exports.listTodayServerBirthday = (bot, serverId, date, channel) => {
    Birthday.find({serverId: serverId, date: date})
        .then(birthdays => {
            for(birthday of birthdays){
                if(channel != false){
                    if(bot.guilds.cache.get(serverId).channels.cache.get(channel) === undefined){
                        bot.guilds.cache.get(serverId).channels.cache.find(channel => channel.type === 'text').send('@everyone :partying_face: Aujourd\'hui c\'est l\'anniversaire de ' + birthday.pseudo + ' ! Bon anniversaire ! :partying_face:')
                            .then(reply => {reply.react('🥳');reply.react('🍰');reply.react('👏')})
                            .catch(error => {console.log(error)});
                    }
                    else{
                        bot.guilds.cache.get(serverId).channels.cache.get(channel).send('@everyone :partying_face: Aujourd\'hui c\'est l\'anniversaire de ' + birthday.pseudo + ' ! Bon anniversaire ! :partying_face:')
                            .then(reply => {reply.react('🥳');reply.react('🍰');reply.react('👏')})
                            .catch(error => {console.log(error)});
                    }
                }
                else{
                    bot.guilds.cache.get(serverId).channels.cache.find(channel => channel.type === 'text').send('@everyone :partying_face: Aujourd\'hui c\'est l\'anniversaire de ' + birthday.pseudo + ' ! Bon anniversaire ! :partying_face:')
                        .then(reply => {reply.react('🥳');reply.react('🍰');reply.react('👏')})
                        .catch(error => {console.log(error)});
                }
            }
        })
        .catch(error => {console.log(error)})
}