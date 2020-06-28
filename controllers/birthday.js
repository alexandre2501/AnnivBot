const Birthday = require('../models/Birthday');

exports.createBirthday = (message, pseudo, date) => {
    //delete req.body._id;
    const birthday = new Birthday({
        userId: message.author.id,
        serverId: message.channel.guild.id,
        pseudo: pseudo,
        date: date,
    });
    birthday.save()
        .then(() => {message.reply('L\'anniversaire de ' + pseudo + ' a bien été ajouté pour le ' + date)})
        .catch(error => {console.log('erreur')});
}

exports.modifyBirthday = (message, pseudo, date) => {
    Birthday.updateOne({ serverId: message.channel.guild.id, pseudo: pseudo}, {date: date})
        .then(birthday => {message.reply('L\'anniversaire de ' + pseudo + ' à été changé !')})
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
        .then(birthday => {message.reply('L\'anniversaire de cet utilisateur est le ' + birthday.date)})
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