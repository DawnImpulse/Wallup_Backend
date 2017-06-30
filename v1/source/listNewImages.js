var sqlQuery        = 'Select aid,details,favouriteCount,downloadCount,viewCount,tags from images '+
                         'WHERE tagged=1 ORDER BY aid DESC LIMIT ?';

var page_no,
    lowerLimit,
    upperLimit,
    sqlQueryParams,
    imagesJson, //json object containing image details
    responseArray   = []; //array
    
w1.on('w1fetch', function (req,res) {
		
    page_no          = req.body.page_no,
    
    upperLimit = page_no*10;
    lowerLimit = upperLimit - 10;
    
    //Querying DB for list of images
    sql_conn.query(sqlQuery,upperLimit,function(err,result){
            if(err)
            {
                    console.log(err);
                    file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});                
                    res.json({success      : "false",
                              errorID      : "listNewImages.w1fetch.query",
                              errorMessage : "Error In Querying Database" }); //Response                
            }else
            {                    
                if(upperLimit>result.length)
                    {
                        upperLimit = result.length;
                    }

                for(var i=lowerLimit;i<upperLimit;i++)  //Creating Image Json Object and pushing to Array
                    {
                        imagesJson = {aid : result[i].aid,
                                      details : result[i].details,
                                      favouriteCount : result[i].favouriteCount,
                                      downloadCount : result[i].downloadCount,
                                      viewCount : result[i].viewCount,
                                      tags : result[i].tags };

                        responseArray.push(imagesJson);
                    }
                    
                res.json({success    : "true",
                            message    : "Successfully Data Returned",
                            images     : responseArray}); //Response

                responseArray = [];
            }
        
        }); //end of sqlConn.query
    });//end of w1.on