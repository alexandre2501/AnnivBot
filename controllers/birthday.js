const Birthday = require('../models/Birthday');
const birthdayChannelCtrl = require('../controllers/birthdayChannel');

const normalizeDate = require('../middleware/normalizeDate');
const checkStrLength = require('../middleware/checkStrLength');

exports.createBirthday = (message, pseudo, date) => {
    //delete req.body._id;
    date = normalizeDate.normalize(date);
    if(pseudo.length > 30){
        message.reply('Le pseudo ne doit pas dépasser 30 caractères.')
    }
    else{
        Birthday.countDocuments({serverId: message.channel.guild.id, pseudo: pseudo})
            .then(count => {
                if(count > 0){
                    message.reply('Cet utilisateur existe déjà, utilisez !bdayBot modifier ' + pseudo + ' ' + date + ' si vous souhaitez modifier son anniversaire.')
                }
                else{
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
            })
            .catch(error => {message.reply('Une erreur est survenue.')});
    }
}

exports.modifyBirthday = (message, pseudo, date) => {
    date = normalizeDate.normalize(date);
    Birthday.countDocuments({serverId: message.channel.guild.id, pseudo: pseudo})
        .then(count => {
            if (count > 0) {
                Birthday.updateOne({ serverId: message.channel.guild.id, pseudo: pseudo}, {date: date})
                    .then(birthday => {message.reply('L\'anniversaire de ' + pseudo + ' a été changé !')})
                    .catch(error => {message.reply('Une erreur est survenue')})
            }
            else {
                message.reply('Cet utilisateur n\'a pas encore entré d\'anniversaire ou n\'existe pas.');
            }
        })
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

exports.cleanInactiveUsers = (message) => {
    //On parcours tout les anniversaire du jour défini sur le serveur
    //On regarde seulement le utilisateur discord
    //Lorsqu'on trouve un utilisateur dans les anniversaire d'aujourd'hui, on vérifie qu'il est encore sur le serveur
    //S'il 'nest plus présent, on le supprime
    Birthday.find({serverId: message.guild.id})
        .then(birthdays => {
            for(birthday of birthdays){
                if(birthday.pseudo[0] === '<' && birthday.pseudo[birthday.pseudo.length - 1] === '>'){
                    let pseudo = birthday.pseudo
                    pseudo = pseudo.replace('<', '');
                    pseudo = pseudo.replace('>', '');
                    pseudo = pseudo.replace('!', '');
                    pseudo = pseudo.replace('@', '');
                    message.guild.members.fetch(pseudo)
                        .then(member => {
                            //console.log(member.user.username)
                        })
                        .catch(error => {
                            Birthday.deleteOne({serverId: message.guild.id, pseudo: birthday.pseudo})
                                .then(birthday => {console.log('test')})
                                .catch(error => {message.reply('Une erreur est survenue')})
                        });
                }
            }
        })
        .catch(error => {message.reply('une erreur est survenue')})
        .finally(() => {message.reply('Nettoyage terminé')})
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
    Birthday.find({ serverId: message.channel.guild.id}).sort({pseudo: 1})
        .then(birthdays => {
            let str = 'Voici les anniversaires de tous les utilisateurs enregistrés : ';
            let text = '';
            let bdayListMessage = [];
            for(birthday of birthdays){
                text += birthday.pseudo + ' : ' + birthday.date + ' | ';
                if(text.length > 1500){
                    text = text.substr(0, text.length - 2);
                    bdayListMessage.push(text);
                    text = '';
                }
            }
            bdayListMessage.push(text);
            str += bdayListMessage[0];
            str = str.substr(0, str.length - 2);
            message.reply(str);
            for(index in bdayListMessage){
                if(index > 0){
                    message.reply(bdayListMessage[index]);
                }
            }
        })
        .catch(error => {message.reply('Une erreur est survenue'); console.log(error)})
}

exports.listTodayServerBirthday = (bot, serverId, date, channel) => {
    Birthday.find({serverId: serverId, date: date})
        .then(birthdays => {
            var birthdaysStr = '';
            if(birthdays.length == 0){
                return;
            }
            for(birthday of birthdays){
                if(birthday.pseudo == birthdays[0].pseudo && birthdays.length <= 2){
                    birthdaysStr += birthday.pseudo + ' et ';
                }
                else{
                    birthdaysStr += birthday.pseudo + ', ';
                }
            }
            //si il n'y a qu'un seul anniversaire, le substr doit etre plus grand pour enlever le et
            if(birthdays.length == 1){
                birthdaysStr = birthdaysStr.substr(0, birthdaysStr.length - 3);
            }
            else{
                birthdaysStr = birthdaysStr.substr(0, birthdaysStr.length - 2);
            }
            var message;
            if(birthdays.length == 1){
                message = '@everyone :partying_face: Aujourd\'hui c\'est l\'anniversaire de ' + birthdaysStr + ' ! Bon anniversaire ! :partying_face:';
            }
            else{
                message = '@everyone :partying_face: Aujourd\'hui c\'est l\'anniversaire de ' + birthdaysStr + ' ! Bons anniversaires ! :partying_face:';
            }
            if(channel != false){
                if(bot.guilds.cache.get(serverId).channels.cache.get(channel) === undefined){
                    bot.guilds.cache.get(serverId).channels.cache.find(channel => channel.type === 'text').send(message)
                        .then(reply => {reply.react('🥳');reply.react('🍰');reply.react('👏')})
                        .catch(error => {console.log(error)});
                }
                else{
                    bot.guilds.cache.get(serverId).channels.cache.get(channel).send(message)
                        .then(reply => {reply.react('🥳');reply.react('🍰');reply.react('👏')})
                        .catch(error => {console.log(error)});
                }
            }
            else{
                bot.guilds.cache.get(serverId).channels.cache.find(channel => channel.type === 'text').send(message)
                    .then(reply => {reply.react('🥳');reply.react('🍰');reply.react('👏')})
                    .catch(error => {console.log(error)});
            }
        })
        .catch(error => {console.log(error)})
}

exports.dump = (message) => {
    Birthday.find({serverId: '727108166311215114'/*"714115851263148093"*/, pseudo: '<@!225959087123333120>'/*'<@261525253363204099>'*/})
        .then(birthdays => {
            for(birthday of birthdays){
                message.reply(birthday.pseudo + ' test')
            }
        })
        .catch()
}