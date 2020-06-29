const Discord = require('discord.js')
const mongoose = require('mongoose');
const bot = new Discord.Client()
const birthdayCtrl = require('./controllers/birthday');
const birthdayChannelCtrl = require('./controllers/birthdayChannel');
const birthdayTimerCtrl = require('./controllers/birthdayTimer')
const env = require('./.env');

//MIDLLEWARE
const checkDate = require('./middleware/checkDate');
const checkCommandParam = require('./middleware/checkCommandParam');
const checkDirectMessage = require('./middleware/checkDirectMessage');

mongoose.connect(env.mongoDbLogin() ,
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

bot.on('ready', function () {
    console.log("Je suis connecté !")
    birthdayTimerCtrl.dailyTimer(bot);
});

bot.on('message', function(message){
    const messageSplit = message.content.split(' ');
    if(checkDirectMessage.guard(message)){
        if(messageSplit[0] === '!annivBot'){
            //Route add
            if(messageSplit[1] === 'ajout'){
                if(checkCommandParam.guard(message, messageSplit, 4)){
                    if(checkDate.guard(message, messageSplit[3])){
                        birthdayCtrl.createBirthday(message, messageSplit[2], messageSplit[3]);
                    }
                }
            }
            //Route list all
            else if(messageSplit[1] === 'listeTous'){
                birthdayCtrl.listAllBirthday(message);
            }
            else if(messageSplit[1] === 'liste'){
                birthdayCtrl.listOneBirthday(message, messageSplit[2]);
            }
            //Route delete
            else if(messageSplit[1] === 'supprimer'){
                if(checkCommandParam.guard(message, messageSplit, 3)){
                    birthdayCtrl.deleteBirthday(message, messageSplit[2]);
                }
            }
            //Route edit
            else if(messageSplit[1] === 'modifier'){
                if(checkCommandParam.guard(message, messageSplit, 4) && checkDate.guard(message, messageSplit[3])){
                    birthdayCtrl.modifyBirthday(message, messageSplit[2], messageSplit[3]);
                }
            }
            else if(messageSplit[1] === 'channel'){
                birthdayChannelCtrl.register(message);
            }
            //Route help
            else if(messageSplit[1] === 'help'){
                message.reply('' +
                    'Voici les commandes disponibles \n ' +
                    '!annivBot help : Affiche les commandes disponibles \n ' +
                    '!annivBot ajout [pseudo] [jour/mois] : Ajoute [pseudo] à la liste d\'anniversaire \n ' +
                    '!annivBot channel : Permet d\'associer le canal en question au bot afin de souhaiter un bon anniversaire.' +
                    '!annivBot modifier [pseudo] [jour/mois] : Modifie l\'anniversaire de [pseudo] \n' +
                    '!annivBot listeTous : Liste tous les annivresaires du serveur \n' +
                    '!annivBot liste [pseudo] : Liste l\'anniversaire de [pseudo] \n' +
                    '!annivBot supprimer [pseudo] : Supprime [pseudo] de la liste d\'anniversaire \n');
            }
            else if(messageSplit[1] === 'dump'){
                console.log(message.channel.type)
            }
            else{
                message.reply('Je ne connais pas cette commande, écris "!annivBot help" afin d\'avoir de l\'aide ');
            }
        }
    }
})

bot.login(env.botToken());