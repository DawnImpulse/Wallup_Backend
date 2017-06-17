var sqlQuery        = "Select f.AID as AID,i.name as name from featured_popular as f, images as i " +
                      "where f.type='popular' AND f.duration=? AND f.image_AID=i.AID ORDER BY f.AID desc LIMIT ? ";

var pageNo,
    duration,
    sqlParams,
    upperLimit,
    lowerLimit,
    responseArray = [];

w3.on('w3fetch',function(req,res){

    pageNo          = req.body.pageNo;
    duration        = req.body.duration;
    
    upperLimit      = pageNo*10;
    lowerLimit      = upperLimit - 10;
    sqlParams       = [duration,upperLimit];
    
    sql_conn.query(sqlQuery,sqlParams,function(err,result){
        if(err){
                    console.log(err);
                    file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});                
                    res.json({success      : "false",
                              errorID      : "listPopular.w3fetch.query",
                              errorMessage : "Error In Querying Database" }); //Response         
        }
        else{
             if(upperLimit>result.length)
                        {
                            upperLimit = result.length;
                        }

                    for(var i=lowerLimit;i<upperLimit;i++)  //Creating Image Json Object and pushing to Array
                        {
                            imagesJson = {AID : result[i].AID,
                                          name : result[i].name}                                                                    
                            
                            responseArray.push(imagesJson);
                        }
                        
                    res.json({success    : "true",
                              message    : "Successfully Data Returned",
                              imagesName : responseArray}); //Response

                    responseArray = [];
            
        }
    });//end of sql query
});//end of w3 fetch