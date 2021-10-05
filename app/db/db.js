const mysql = require("mysql2/promise");

var config =
{
    host: '192.168.0.29',
    user: 'root',
    password: 'strongpassword',
    database: '_mysql',
};

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected'){
        //console.log("MySql Connection Recovered");
        return global.connection;
    }
    const connection = await mysql.createConnection(config);
    //console.log("MySql Connection Started");
    global.connection = connection;
    return connection;
}
module.exports = {connect}