
const ctrlLogin = require('./ctrl_Login')
const ctrlJob = require('./ctrl_Job')
const ctrlNav = require('./ctrl_Nav')
const ctrlFilter = require('./ctrl_Filter')
const CtrlTicketOpen = require("./ctrl_Ticket")
const ctrl_TicketToDB = require("../db/ticketToDb")
const CtrlSla = require("./ctrl_slatToDB")
const moment = require('moment');
const voidinfo = require('./voids_info')
const order = require('./ctrl_Order')

async function run(browser){
    Ctrl(browser)
}

async function Ctrl(browser){
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await ctrlNav.goto(page,"loginPage")
    var x = false
    do{
        try {
            if(await ctrlJob.getJobStatus()){
                await ctrlLogin.login(page)
                await ctrl_TicketToDB.updateSerialObs(page)
                await ctrlFilter.setFilter(page,"ticketActive")
                await CtrlTicketOpen.run(page,"Active")
                await voidinfo.run(page);
                if(x){
                    await ctrlLogin.login(page)
                    await ctrlFilter.setFilter(page,"ticketActive")
                    await ctrlFilter.setFilter(page,"ticketActive2")
                    await CtrlTicketOpen.run(page,"Active")
                    x = false
                }else{
                    x = true
                }
                await order.run(page)
                await CtrlSla.run();
            }else{
                console.log("Esperando o time out")
                page.waitForTimeout(10000);
                console.log("Esperando o time out concluido")
            }
        } catch (error) {
           // console.log(error)
        }
        
    }while(true)
} 




module.exports = {run}