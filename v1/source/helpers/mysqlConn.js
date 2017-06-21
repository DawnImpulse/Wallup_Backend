var sql_decl         = require ('mysql');    

global.sql_conn = sql_decl.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    database: "wallup",
    password: process.env.DB_PASS
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