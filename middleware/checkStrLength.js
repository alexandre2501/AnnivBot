exports.guard = (str, len) => {
    if(str.length > len){
        return false;
    }
    else{
        return true;
    }
}