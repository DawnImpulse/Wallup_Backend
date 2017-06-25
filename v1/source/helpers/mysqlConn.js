var sql_decl         = require ('mysql');    

var db_config = {
    host: "localhost",
    user: process.env.DB_USER,
    database: "wallup",
    password: process.env.DB_PASS
};

global.sql_conn;
function handleDisconnect() {
  sql_conn = sql_decl.createConnection(db_config); 
                                                  
  sql_conn.connect(function(err) {              
    if(err) {                                     
      console.log('Error Connecting to DB :', err);
      setTimeout(handleDisconnect, 2000); 
    }else
    {
        console.log("Successfully Connected to DB");
    }                                  
  });                                     
                                          
  sql_conn.on('error', function(err) {
    console.log('DB Error ', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      handleDisconnect();                         
    } else {                                      
      throw err;                                  
    }
  });
};

handleDisconnect();

setInterval(function () {
    sql_conn.query('SELECT 1');
}, 30*1000);