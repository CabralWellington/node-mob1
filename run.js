const puppeteer = require('puppeteer');
const job = require("./app/ctrl/ctrl_Job")
const ctrlLogin = require('./app/ctrl/ctrl_Login')
const ctrlNav = require('./app/ctrl/ctrl_Nav')
const ctrlFilter = require('./app/ctrl/ctrl_Filter')
const CtrlTicketOpen = require("./app/ctrl/ctrl_Ticket")
const CtrlSla = require("./app/ctrl/ctrl_slatToDB")
const voidinfo = require('./app/ctrl/voids_info')
const order = require('./app/ctrl/ctrl_Order')
const CtrlTicketDeactive = require("./app/ctrl/ctrl_Ticket")
const info = require("./app/info/passwords");
const moment = require('moment');

run();

async function run(){
        const runExecution = 5
        do {
            const browser1 = await startBrowser();
        try {
            if(await job.getJobStatus()){
                const page = await browser1.newPage();
                await page.setCacheEnabled(false);    
                await ctrlNav.goto(page,"loginPage")    
                await job.sleep(10000)
                await ctrl(page,runExecution)
            }
        } catch (error) {
            toSpeeak(error)
            browser1.close();
        }finally{
            browser1.close();
        }
        } while (true);
}

async function ctrl(page, runExecution){
    for (var index = 0; index < runExecution; index++) {
        toSpeeak("Execução " + index)
        if(index==2){
            await ctrlRun(info.getOption2(), page);
            await job.sleep(5000)  
        }else{
            await ctrlRun(info.getOption(), page);
            await job.sleep(5000)  
        }
    }
}

async function ctrlRun(runOption,page){
    try {
        switch (runOption) {
            case "A":
                await ctrlLogin.login(page)
                await ctrlFilter.setFilter(page,"ticketActive")
                await CtrlTicketOpen.run(page,"Active")
                await CtrlSla.run();
            break;
            case "B":
                await ctrlLogin.login(page)
                await order.run(page)
                await voidinfo.run(page);
            break;
            case "C":
                await ctrlLogin.login(page)
                await ctrlFilter.setFilter(page,"ticketActive")
                await ctrlFilter.setFilter(page,"ticketActive2")
                await CtrlTicketOpen.run(page,"Active")
            break;
            case "D":
                await ctrlLogin.login(page)
                await ctrlFilter.setFilter(page,"ticketActive")
                await ctrlFilter.setFilter(page,"ticketActive2")
                await ctrlFilter.setFilter(page,"ticketActive2")
                await ctrlFilter.setFilter(page,"ticketActive2")
                await CtrlTicketOpen.run(page,"Active")
            break;
            case "DEL":
                await ctrlLogin.login(page);
                await ctrlFilter.setFilter(page,"ticketDeactive")
                await CtrlTicketDeactive.run(page,"Deactive")
            break;
            default:
            break;
        }   
    } catch (error) {
        toSpeeak(error)
    }
}

async function toSpeeak(text){
    console.log(moment().format("DD/MM HH:mm") + " - " +text)

}

async function startBrowser(){
    await job.sleep(5000)
    return puppeteer.launch({
        headless: false,
        args: ['--no-sandbox']
     })
}