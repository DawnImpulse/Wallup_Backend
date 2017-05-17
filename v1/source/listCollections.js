var sql          = require('mysql'),
    file         = require('fs'),
    path         = require('path'),
    events       = require('events'),
    collectionJson,
    responseArray = [],
    dateTime     = new Date(),
    sqlQuery     = "Select AID,name,images,highlights from Collection ORDER BY NAME ASC",
    errorLogFile = path.resolve(__dirname,'..','..','./logs') + '/errorLogs.txt';

global.w2 = new events.EventEmitter();

w2.on('w2fetch',function(req,res){
   sqlConn.query(sqlQuery,function(err,result){
       
       if(err)
           {
                file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                console.log(err);
                res.json({success      : "false",
                          errorID      : "listNewImages.w2fetch.query",
                          errorMessage : "Error In Querying Database" }); //Response   
           }else{
               
               for(var i in result)
                   {
                       collectionJson = {AID        : result[i].AID,
                                         name       : result[i].name,
                                         images     : result[i].images,
                                         highlights : result[i].highlights};
                       responseArray.push(collectionJson);
                   }
            
               res.json({
                    success     : "true",
                    message     : "Successful Data Returned",
                    collections : responseArray});
               
               responseArray = [];
           }
   });//end of sql query
});//end of w2.on 

