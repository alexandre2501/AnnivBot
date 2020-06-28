exports.guard = (message, array, length) => {
    if(array.length === length){
        return true;
    }
    else{
        message.reply('Erreur: Les paramètres fournis ne conviennet pas. Utilise !annivBot help pour plus d\'infos.');
        return false;
    }
}