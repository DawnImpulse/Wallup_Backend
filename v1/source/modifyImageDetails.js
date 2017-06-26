var sql_query_image_update      = `INSERT INTO featured_popular(image_aid,type,duration) VALUES (?,?,?) `,
    sql_query_image_tags        = `UPDATE images SET tags=? WHERE aid=?`,
    sql_query_add_category      = `INSERT INTO collection(type,name) values (?,?)`,
    sql_query_category_images   = `SELECT images FROM collection WHERE aid=?`,
    sql_query_category_image_add= `UPDATE collection SET images=? WHERE aid=?`,
    sql_query_category_highlig  = `UPDATE collection SET highlights=? WHERE aid=?`;
    sql_query_tagged_image      = `UPDATE images SET tagged=? WHERE aid=?`;


var type,
    mode,
    image_aid,
    uid_given,
    uid_in_token,
    duration,
    tags,
    category_aid,
    category_images;

w8.on('w8modifyImage',function(req,res){
var user_verify_response = userVerify(req);
    if(user_verify_response.success === "false")
    {
        res.json({success       : "false",
                  errorID       : user_verify_response.errorID,
                  errorMessage  : user_verify_response.errorMessage
                });
    }else
    {   
        if(!req.body.mode)
        {
            res.json({success       : "false",
                      errorID       : "no-mode-provided",
                      errorMessage  : "No mode provided" })
        }else //different modes
        {
            mode = req.body.mode;
            if(parseInt(mode) == 0) //popular/featured
            {
                type        = req.body.type;
                image_aid   = req.body.image_aid;
                if(!req.body.duration) {duration = null;}            
                else {duration = req.body.duration;}
                    
                sql_conn.query(sql_query_image_update,[image_aid,type,duration],function(err,result){
                    if(err)
                    {
                        res.json({success       : "false",
                                    errorID       : "query-failed",
                                    errorMessage  : "Server Error"
                                });
                        file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                    }else
                    {
                        res.json({success       : "true",
                                    message       : "Successfully Added" 
                                });                
                    }
               });//end of query                    
            }else if(parseInt(mode) == 1) //update tags
                {                                    
                    tags        = req.body.tags;
                    image_aid   = req.body.image_aid;
                    sql_conn.query(sql_query_image_tags,[tags,image_aid],function(err,result){
                        if(err)
                        {
                            res.json({success       : "false",
                                      errorID       : "query-failed",
                                      errorMessage  : "Server Error"
                                    });
                            file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                        }else
                        {
                            res.json({success : "true",
                                      message : "Successfully Updated"
                                    });
                        }
                    });//end of query
                }else if(parseInt(mode) == 2) //update category images
                        {
                            var category_aid = req.body.category_aid;
                            image_aid        = req.body.image_aid;

                            var query_end = 0;

                            sql_conn.query(sql_query_category_images,category_aid,function(err,result){
                                if(err)
                                {
                                    res.json({success       : "false",
                                               errorID       : "query-failed",
                                               errorMessage  : "Server Error"
                                              });
                                    file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                                    query_end = 2;
                                }else
                                {                                              
                                    if(result[0].images == null)
                                    {                                        
                                        category_images = [];                                        
                                        category_images[0]= image_aid;                                    
                                    }
                                    else
                                    {                                        
                                        category_images = JSON.parse(result[0].images);
                                        category_images[category_images.length]= image_aid;  
                                    } 
                                    
                                    query_end = 1;                                          
                                }
                            });//end of query

                            while(query_end == 0){sleep(10)};

                            if(query_end == 1)
                            {
                                sql_conn.query(sql_query_category_image_add,[JSON.stringify(category_images),category_aid],function(err,result){
                                    if(err)
                                    {
                                        res.json({success       : "false",
                                                  errorID       : "query-failed",
                                                  errorMessage  : "Server Error"
                                                });
                                        file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                                    }else
                                    {
                                        res.json({success : "true",
                                                  message : "Successfully Updated"})
                                    }
                                });
                            }
                        }else if(parseInt(mode) == 3) //new category
                                {
                                    var type    = req.body.type,
                                        name    = req.body.name;

                                    sql_conn.query(sql_query_add_category,[type,name],function(err,result){
                                        if(err)
                                        {
                                            res.json({success       : "false",
                                                      errorID       : "query-failed",
                                                      errorMessage  : "Server Error"
                                                    });
                                            file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                                        }else
                                        {
                                            res.json({success : "true",
                                                      message : "Successfully Added"
                                                    });
                                        }
                                    });

                                }else if(parseInt(mode) == 4)//update highlights
                                        {
                                            var highlights   = req.body.highlights,
                                                category_aid = req.body.category_aid;

                                            sql_conn.query(sql_query_category_highlig,[highlights,category_aid],function(err,result){
                                                if(err)
                                                {
                                                    res.json({success       : "false",
                                                              errorID       : "query-failed",
                                                              errorMessage  : "Server Error"
                                                            });
                                                    file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                                                }else
                                                {
                                                    res.json({success : "true",
                                                              message : "Successfully Updated"});                                                    
                                                }
                                            });//end of query
                                        }else if(parseInt(mode) == 5) //tagged images
                                                {                           
                                                    image_aid = req.body.image_aid;                                                    
                                                    sql_conn.query(sql_query_tagged_image,[parseInt(`1`),image_aid],function(err,result){
                                                        if(err)
                                                        {
                                                             res.json({success       : "false",
                                                                       errorID       : "query-failed",
                                                                       errorMessage  : "Server Error"
                                                                    });
                                                            file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                                                        }else
                                                        {
                                                            res.json({success : "true",
                                                                      message : "Successfully Updated"});                                                             
                                                        }
                                                    });//end of query
                                                }

        }

        
    }
});//end of w8 modifyImage

function userVerify(req) //verify user token & access
{
    var response,        
        query_end=0;
    var token_verify = verifyToken(req.body.token);
    if(token_verify.success == "true")
    {
        uid_in_token = token_verify.uid;
        uid_given    = req.body.uid;
                
        if(uid_in_token !== uid_given) 
        {
            response = {success     : "false",
                        errorID     : "uid-mismatch",
                        errorMessage: "Token Mismatch from uid"
                        };
        }else
        {
            sql_conn.query("SELECT access FROM users WHERE uid=?",uid_in_token,function(err,result){
            if(err)
            {
                response = {success       :"false",
                            errorID       : "query-failed",
                            errorMessage  : "Server Error"
                            };  
                file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                query_end = 1;

            }else
            {                
                if(result[0].access === "admin")
                {
                    response = {success : "true"};
                    query_end = 1;
                }else
                {
                    response = {success     : "false",
                                errorID     : "no-admin-access",
                                errorMessage: "Not an Admin ID"
                                };
                            
                    query_end = 1;

                }
            }
         });//end of query
         while(query_end==0){sleep(10)};
        }                
    }else
    {
        response = {success     : "false",
                    errorID     : "token-verify-failed",
                    errorMessage: token_verify.errorName 
                    };
    }
    
    return response;
}