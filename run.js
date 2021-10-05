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
const db = require("./app/db/db");

run();

async function run(){
    /* opção de qual codigo vai executar
        option = A  -> Atualização de 800 atendimentos 
    */
    const option = info.getOption();
    const runExecution = 5
    var executar = 0
    //db.connect();
    do {
        try {
            if(await job.getJobStatus()){
                i = 0
                const browser1 = await puppeteer.launch({
                   // headless: false,
                    args: ['--no-sandbox']
                 });
                const page = await browser1.newPage();
                await page.setCacheEnabled(false);    
                await ctrlNav.goto(page,"loginPage")    
                do {
                    i++
                    if(i!=5){
                        await ctrlRun(option, page);
                        await job.sleep(5000)
                    }else{
                        await ctrlRun(info.getOption2(), page);
                        await job.sleep(5000)  
                    }
                } while (i!=runExecution);
                browser1.close();
            }
            await job.sleep(1000*60)
        } catch (error) {
            console.log(error)
    
        }
        executar++
        console.log(executar)
        await job.sleep(1000*60)
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

