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
    /* opção de qual codigo vai executar
        option = A  -> Atualização de 800 atendimentos 
    */
    const option = info.getOption();
    const option2 = info.getOption2();
    const runExecution = 5
    var executar = 0
    //db.connect();
    do {
        await toSpeeak();
        const browser1 = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox']
         });
        try {
            if(await job.getJobStatus()){
                const page = await browser1.newPage();
                await page.setCacheEnabled(false);    
                await ctrlNav.goto(page,"loginPage")    
                await job.sleep(10000)

            }
        } catch (error) {
            browser1.close();
        }
        executar++
        console.log('Numero de execuções é : '+executar)
        await job.sleep(1000)
    } while (true);
}


async function ctrlRun(runOption,page){
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
}

async function toSpeeak(){
    console.log(moment().format())
    await job.sleep(10000)
}