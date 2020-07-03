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
        if(messageSplit[0] === '!bdayBot'){
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
                    '```Voici les commandes disponibles : ```' +
                    '```!bdayBot help : Affiche les commandes disponibles ``` ' +
                    '```!bdayBot ajoute [pseudo] [jour/mois] : Ajoute [pseudo] à la liste d\'anniversaires ``` ' +
                    '```!bdayBot channel : Permet d\'associer le canal en question au bot afin de souhaiter un bon anniversaire. ```' +
                    '```!bdayBot modifier [pseudo] [jour/mois] : Modifie l\'anniversaire de [pseudo] ```' +
                    '```!bdayBot listeTous : Liste tous les annivresaires du serveur ```' +
                    '```!bdayBot liste [pseudo] : Liste l\'anniversaire de [pseudo] ```' +
                    '```!bdayBot supprimer [pseudo] : Supprime [pseudo] de la liste d\'anniversaires ```' +
                    '```Les mots entre crochet indiquent un paramètre variable. ```');
            }
            /*else if(messageSplit[1] === 'dump'){
                console.log(message.channel.type)
            }*/
            else{
                message.reply('Je ne connais pas cette commande, écris "!bdayBot help" afin d\'avoir de l\'aide ');
            }
        }
    }
})

bot.login(env.botToken());