const db = require("../db/db");
const toDB = require("../db/ticketToDb")
const info = require("../info/passwords");
module.exports = {run}
async function run(page){
   await ctrlOrder(page)
}

async function ctrlOrder(page){
    let size
    const conn = await db.connect();
    const [rows] = await conn.query('SELECT nome_tec_setor,tec_id FROM _mysql.setor where tec_id != "X_X"');
       
    await page.goto(info.getDefaultURL()+"/Tracker/TrackerTicket/Order")
    await page.waitForTimeout(10000); 
        try {
            for (let index = 0; index < rows.length; index++) {
                
                
                console.log(rows[index].tec_id)
                await page.evaluate(val => $("#SmyowlIdKey").val(val).change(), rows[index].tec_id);
                await page.waitForTimeout(10000);
                console.log(rows[index].nome_tec_setor)
                await conn.query('update atendimentos set atend_priorizacao = 0 where atend_status = "Aberto" and nome_tec = "'+ rows[index].nome_tec_setor+'"')
                size = await page.evaluate(val => document.querySelector("#tableAlarm > tbody").rows.length);
                console.log(size)
                for (let i = 1; i < size+1 ; i++) {
                    try {
                        await toDB.updateOrder(i,await page.evaluate(val => document.querySelector("#tableAlarm > tbody > tr:nth-child("+val+") > td:nth-child(2)").innerText,i))
                    } catch (error) {
                    }
                }
                             
            }
        } catch (error) {
            console.log(error)
        }
}