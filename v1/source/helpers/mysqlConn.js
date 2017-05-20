var sqlDecl         = require ('mysql');    

global.sqlConn = sqlDecl.createConnection({
    host: "localhost",
    user: "root",
    database: "wallup",
    password: "root"
});

sqlConn.connect(function(err){
    if(err)
    {
        console.log('Error Connecting DB');
        file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);})                
    }else
        {
            console.log('Connected to DB Successfully');
        }
});