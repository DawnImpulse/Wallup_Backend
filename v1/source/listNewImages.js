var sql      = require('./mysqlConn.js'),
    events   = require('events'),
    file     = require('fs'),
    path     = require('path'),
    pageNo,
    thumbnailSize,
    lowerLimit,
    upperLimit,
    sqlQueryParams,
    imagesJson, //json object containing image details
    responseArray   = [], //array
    dateTime        = new Date(); //get current date time
    sqlQuery        = 'Select AID,name,favouriteCount,downloadCount,viewCount,tags from Images ORDER BY AID DESC LIMIT ?',
    errorLogFile    = path.resolve(__dirname,'..','..','./logs') + '/errorLogs.txt';
    

global.w1 = new events.EventEmitter();

w1.on('w1fetch', function (req,res) {
		
    pageNo          = req.body.pageNo,
    thumbnailSize   = req.body.thumbnailSize;
    
    upperLimit = pageNo*10;
    lowerLimit = upperLimit - 10;
    
    //Querying DB for list of images
    sqlConn.query(sqlQuery,upperLimit,function(err,result){
            if(err){
                    console.log(err);
                    file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});                
                    res.json({success      : "false",
                              errorID      : "listNewImages.w1fetch.query",
                              errorMessage : "Error In Querying Database" }); //Response                
                }else{                    
                    if(upperLimit>result.length)
                        {
                            upperLimit = result.length;
                        }

                    for(var i=lowerLimit;i<upperLimit;i++)  //Creating Image Json Object and pushing to Array
                        {
                            imagesJson = {AID : result[i].AID,
                                          name : result[i].name,
                                          favouriteCount : result[i].favouriteCount,
                                          downloadCount : result[i].downloadCount,
                                          viewCount : result[i].viewCount,
                                          tags : result[i].tags};
                            responseArray.push(imagesJson);
                        }
                        
                    res.json({success    : "true",
                              message    : "Successfully Data Returned",
                              imagesName : responseArray}); //Response

                    responseArray = [];
                }
        
        }); //end of sqlConn.query
    });//end of w1.on