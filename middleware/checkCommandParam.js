exports.guard = (message, array, length) => {
    if(array.length === length){
        return true;
    }
    else{
        message.reply('Erreur: Les paramètres fournis ne conviennent pas. Utilise !bdayBot help pour plus d\'infos.');
        return false;
    }
}