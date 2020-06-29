exports.guard = (message) => {
    if(message.channel.type === 'dm'){
        return false;
    }
    else{
        return true;
    }
}