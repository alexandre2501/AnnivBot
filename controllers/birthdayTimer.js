const birthdayChannelCtrl = require('../controllers/birthdayChannel');

exports.Time = {
    now: null,
    midnight: null,
    hourTillMidnight: null,
    updateDate: () => {
        this.Time.now = new Date(Date.now());
        this.Time.midnight = new Date(Date.now());
        this.Time.hourTillMidnight = 24 - this.Time.now.getHours();
        this.Time.midnight.getTime();
        this.Time.midnight.setHours(24);
        this.Time.midnight.setMinutes(01);
        this.Time.midnight.setSeconds(00);
    }
}


exports.dailyTimer = (bot) => {

    this.Time.updateDate();

    //console.log(bot.guilds.cache.get('725380428680265778').channels.cache.get('725380428680265781'))
    let serversId = bot.guilds.cache.keyArray();

    const timestampTillMidnight = this.Time.midnight.getTime() - this.Time.now.getTime();
    console.log(timestampTillMidnight)
    let month = this.Time.midnight.getMonth() + 1
    let dateStr = this.Time.midnight.getDate() + '/' + month;
    console.log(dateStr);
    var self = this
    setTimeout(function(){
        for(index in serversId){
            birthdayChannelCtrl.getRegisteredChannel(bot, serversId[index], '29/06'/*dateStr*/)
            self.Time.updateDate();
            console.log(self.Time)
        }
        setInterval(function(){
            birthdayChannelCtrl.getRegisteredChannel(bot, serversId[index], '29/06'/*dateStr*/)
            self.Time.updateDate();
        }, 86400000)
        }, timestampTillMidnight);
}

