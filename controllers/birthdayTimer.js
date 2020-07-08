const birthdayChannelCtrl = require('../controllers/birthdayChannel');

const normalizeDate = require('../middleware/normalizeDate')

exports.Time = {
    now: null,
    midnight: null,
    hourTillMidnight: null,
    dateStr: null,
    updateDate: () => {
        this.Time.now = new Date();
        this.Time.midnight = new Date();
        this.Time.hourTillMidnight = 24 - this.Time.now.getHours();
        this.Time.midnight.getTime();
        this.Time.midnight.setHours(24);
        this.Time.midnight.setMinutes(1);
        this.Time.midnight.setSeconds(0);
        var month = this.Time.midnight.getMonth() + 1;
        this.Time.dateStr = this.Time.midnight.getDate() + '/' + month;
        this.Time.dateStr = normalizeDate.normalize(this.Time.dateStr);
    }
}


exports.dailyTimer = (bot) => {

    this.Time.updateDate();

    //console.log(bot.guilds.cache.get('725380428680265778').channels.cache.get('725380428680265781'))
    let serversId = bot.guilds.cache.keyArray();
    console.log(serversId);

    const timestampTillMidnight = this.Time.midnight.getTime() - this.Time.now.getTime();
    console.log(timestampTillMidnight);
    let month = this.Time.midnight.getMonth() + 1
    //let dateStr = this.Time.midnight.getDate() + '/' + month;
    var self = this;
    setTimeout(function(){
        console.log("timeOut end")
        for(index in serversId){
            console.log(self.Time.dateStr)
            birthdayChannelCtrl.getRegisteredChannel(bot, serversId[index], self.Time.dateStr)
        }
        self.Time.updateDate();
        setInterval(function(){
            console.log('interval start')
            for(index in serversId){
                birthdayChannelCtrl.getRegisteredChannel(bot, serversId[index], self.Time.dateStr)
            }
            self.Time.updateDate();
        }, 86400000)
        }, timestampTillMidnight);

}

