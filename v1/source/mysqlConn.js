var sqlDecl         = require ('mysql'),
    path            = require('path'),
    file            = require('fs'),
    dateTime        = Date();
    errorLogFile    = path.resolve(__dirname,'..','..','./logs') + '/errorLogs.txt';

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