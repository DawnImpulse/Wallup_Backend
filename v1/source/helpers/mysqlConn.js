var sql_decl         = require ('mysql');    

global.sql_conn = sql_decl.createConnection({
    host: "localhost",
    user: "root",
    database: "wallup",
    password: "root"
});

sql_conn.connect(function(err){
    if(err)
    {
        console.log('Error Connecting DB');
        file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);})                
    }else
        {
            console.log('Connected to DB Successfully');
        }
});