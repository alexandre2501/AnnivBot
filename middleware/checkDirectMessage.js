exports.guard = (message) => {
    if(message.channel.type === 'dm'){
        console.log(message.content)
        return false;
    }
    else{
        return true;
    }
}