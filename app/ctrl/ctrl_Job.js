var moment = require('moment'); // require
async function getJobStatus(){
    var option = false 
    if(moment().weekday()=="6" || moment().weekday()=="7"){
            console.log("Final de Semana 1")
            await sleep(10000)
     }else if(moment().format("HH:mm")>="06:00" && moment().format("HH:mm")<="19:00"){
            console.log("Dia de Semana");
            option = true
            await sleep(10000)
     }
     console.log(option)
     return option
}
async function sleep(ms){
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

module.exports = {getJobStatus,sleep}