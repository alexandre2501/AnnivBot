exports.guard = (message, date) => {
    if(date.indexOf('/') != -1){
        const dateSplit = date.split('/');
        console.log(dateSplit.length);
        if(dateSplit.length === 2){
            if(parseInt(dateSplit[0]) != NaN || parseInt(dateSplit[1] != NaN)){
                if(parseInt(dateSplit[0]) > 0 && parseInt(dateSplit[0]) < 32 && parseInt(dateSplit[1]) > 0 && parseInt(dateSplit[1]) < 13){
                    return true;
                }
                else{
                    message.reply('Le format de la date n\'est pas bon. Utilise le format suivant : jour/mois. Exemple : 01/01');
                    return false
                }
            }
            else{
                //le jour ou le mois ne sont pas des entier
                message.reply('Le format de la date n\'est pas bon. Utilise le format suivant : jour/mois. Exemple : 01/01');
                return false
            }
        }
        else{
            //la date est trop longue ou trop courte (mauvais format)
            message.reply('Le format de la date n\'est pas bon. Utilise le format suivant : jour/mois. Exemple : 01/01');
            return false
        }
    }
    else{
        //Il n'y a pas de / dans la date (mauvais format)
        message.reply('Le format de la date n\'est pas bon. Utilise le format suivant : jour/mois. Exemple : 01/01');
        return false
    }
}