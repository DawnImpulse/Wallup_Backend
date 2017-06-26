var sqlQuery     = "Select aid,name,images,highlights from collection ORDER BY NAME ASC";   

var collectionJson,
    responseArray = [];

w2.on('w2fetch',function(req,res){
   sql_conn.query(sqlQuery,function(err,result){
       
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
                       collectionJson = {aid        : result[i].aid,
                                         name       : result[i].name,
                                         images     : result[i].images,                                         
                                         highlights : result[i].highlights,
                                         importance : result[i].importance
                                        };
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

