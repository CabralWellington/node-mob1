const info = require("../info/passwords");
async function goto(page,option){
    switch(option){
        
        case "ticketPage":
            await page.goto(info.getDefaultURL()+"/Tracker/TrackerTicket")
            await page.waitForTimeout(60000); 
        break
        case "loginPage":
            await page.goto(info.getDefaultURL()+"/User/LogOn?ReturnUrl=%2f")
            await page.waitForTimeout(3000); 
        break
        case "OrderPage":
            await page.goto(info.getDefaultURL()+"/Tracker/TrackerTicket/Order")
            await page.waitForTimeout(3000); 
        break
    }
}

module.exports = {goto}