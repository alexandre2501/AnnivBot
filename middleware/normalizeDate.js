exports.normalize = (date) => {
    const dateSplit = date.split('/');
    console.log(dateSplit[0].length);
    if(dateSplit[0].length === 1){
        dateSplit[0] = '0' + dateSplit[0];
    }
    if(dateSplit[1].length === 1){
        dateSplit[1] = '0' + dateSplit[1];
    }
    date = dateSplit.join('/');
    return date;
}