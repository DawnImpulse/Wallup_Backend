var sql_query_verify_email  = `SELECT * FROM users WHERE email=?`,
    sql_query_signup        = `INSERT INTO users(uid,name,email,password) values(?,?,?,?)`,
    sql_query_signup_google = `INSERT INTO users(uid,name,email,gid,dp) values(?,?,?,?,?)`,    
    sql_query_signup_fb     = `INSERT INTO users(uid,name,email,fid,dp) values(?,?,?,?)`,    
    sql_query_google_update = `UPDATE USERS SET gid=? WHERE email=?`,
    sql_query_google        = `SELECT * FROM users WHERE gid=?`,
    sql_query_facebook      = `SELECT * FROM users WHERE fid=?`;
 
var mode,
    client,
    gid,
    fid,
    email,
    password,
    dp,
    name,
    token,
    email_verify_result;
    
w9.on(`w9login`,function(req,res){
    
    mode = req.body.mode;    
    if(mode === "login") //Native Login
        {
            email        = req.body.email;
            password     = req.body.password;           
            
            sql_conn.query(sql_query_verify_email,[email],function(err,result){
                
                if(err) //query error
                    {
                        file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                        res.json({success       : "false",
                                  errorID       : "query-failed",
                                  errorMessage  : "Server Error"
                                 });
                    }else //query success
                    {
                        if(result.length==1)
                            {
                                var hash_verify_result = hashingVerify(password.concat(`stonehashing`),result[0].password);                      
                                if(hash_verify_result.success === "true")
                                    {
                                        userDetails(result,res);   
                                    }else
                                    {
                                        if(!hash_verify_result.errorID)
                                        {
                                            res.json({success       : "false",
                                                      errorID       : "password-verification-failed",
                                                      errorMessage  : "Password Invalid" });
                                        }else
                                        {
                                            res.json({success       : "false",
                                                      errorID       : "hash-verify-failed",
                                                      errorMessage  : "Password Invalid" });
                                        }
                                    }
                            }else
                            {
                                res.json({success       : "false",
                                          errorID       : "authentication-problem",
                                          errorMessage  : "User Authentication Problem"
                                         });
                            }
                    }
            });
            
        }else if(mode === "glogin") //3rd party login
        {
           
            client = req.body.client;
            if(client === `google`)//Google Login
                {
                    gid = req.body.gid;
                    var callback;
                    sql_conn.query(sql_query_google,gid,function(err,result){                        
                        
                        if(err)
                            {
                                file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                                res.json({success       : "false",
                                          errorID       : "query-failed",
                                          errorMessage  : "Server Error"
                                         });  
                                callback=0;
                            }else
                                {
                                    if(result.length==1)
                                        {                                                                                        
                                            userDetails(result,res);
                                            callback=0;
                                        }else
                                        {
                                            callback=1;
                                            
                                        }
                                }
                    });//end of query
                    
                    while(!callback){sleep(10)};
                    if(callback==1){userSignUp(req,res,1);}
                }else //Facebook Login
                {
                    var rsul = emailVerify(req.body.email);
                    res.json({success : rsul.success});
                }
        }else if(mode === "verify")// Verify Email
        {            
            email = req.body.email;
                
            var email_verify_result = emailVerify(email);   
            if(email_verify_result.success === "true")
                {
                    res.json({success : "true",
                              message : "Email Found"
                             });
                }else 
                {
                    if(email_verify_result.errorID !== "query-failed")
                        {
                           res.json({success      : "false",
                                     errorID      : "email-not-found",
                                     errorMessage : "Email Not Found"
                                    }); 
                        }else
                        {
                            res.json({success      : "false",
                                      errorID      : "email-query-failed",
                                      errorMessage : "Server Error"
                                    }); 
                        }
                    
                }
        
        }else if(mode === "signup")
        {
            email_verify_result = emailVerify(req.body.email);
            if(email_verify_result.success === "false")
                {
                    userSignUp(req,res,0);
                }else if(!email_verify_result.errorID)
                    {
                        res.json({success       : "false",
                                  errorID       : "email-already-present",
                                  errorMessage  : "Email Already Present"
                                 })
                    }else
                    {
                        res.json({success      : "false",
                                  errorID      : "email-query-failed",
                                  errorMessage : "Server Error"
                                });
                    }            
        }else //Forgot Password
        {
            
        }
});//end of w9login

function userDetails(user_result,res)
{
    var token_response = generateToken(user_result[0].uid);
    if(token_response.success === "true")
        {
            var details = {uid      : user_result[0].uid,
                           token    : token_response.token,
                           email    : user_result[0].email,
                           dp       : user_result[0].dp,
                           access   : user_result[0].access,
                           name     : user_result[0].name
                          };
            res.json({success : "true",
                      message : "User Authenticated Successfully",
                      details : details
                     });
        }else
        {
         res.json({success : "false",
                   errorID : "token-failed",
                   errorMessage : "Server Error"
                  })   
        }            
}

function userSignUp(req,res,client_mode)
{
    if(client_mode==0)//native
    {
        var name = req.body.name;
        var email = req.body.email;
        var temp_password = req.body.password;
        var uid;
        
        var generate_uid_result = generateUID();
        var password_hashing    = hashing(temp_password.concat(`stonehashing`));
        
        if(generate_uid_result.success === "true")
            {
                uid = generate_uid_result.uid;        
            }else
            {
                 res.json({success       : "false",
                           errorID       : "user_signup-uid-generate-failed",
                           errorMessage  : "Server Error"
                          });
            }
        
        if(password_hashing.success === "true")
            {
                password = [password_hashing.hash];
            }else
            {
                res.json({success       : "false",
                          errorID       : "user_signup-hashing-failed",
                          errorMessage  : "Server Error"
                          });
            }        
        
        sql_conn.query(sql_query_signup,[uid,name,email,password],function(err,result){
           
            if(err)
                {
                    file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                    res.json({success       : "false",
                              errorID       : "query-failed",
                              errorMessage  : "Server Error"
                             });
                }else
                {
                   res.json({success : "true",
                             message : "Successfully Signed Up"
                            });
                }
        });//end of query
    }else if(client_mode==1)//google
        {            
            email = req.body.email;            
            var verify_result = emailVerify(email);    
            if(verify_result.success === "true")
                {
                    gid = req.body.gid;                    
                    sql_conn.query(sql_query_google_update,[gid,email],function(err,result)
                    {
                        if(err)              
                            {
                                res.json({success       : "false",
                                          errorID       : "query-failed",
                                          errorMessage  : "Server Error"
                                        });  
                            }else
                            {
                                sql_conn.query(sql_query_google,gid,function(err,result){
                                   
                                    if(err)
                                        {
                                            res.json({success       : "false",
                                                      errorID       : "query-failed",
                                                      errorMessage  : "Server Error"
                                            });  
                                        }else
                                        {
                                            userDetails(result,res);
                                        }
                                });                                
                            }
                    });  
                }else if(!verify_result.errorID)
                    {
                        var name    = req.body.name;
                        var email   = req.body.email;
                        var gid     = req.body.gid;
                        var dp      = req.body.dp;
                        var uid;

                        var generate_uid_result = generateUID();            

                        if(generate_uid_result.success === "true")
                            {
                                uid = generate_uid_result.uid;        
                            }else
                            {
                                 res.json({success       : "false",
                                           errorID       : "user_signup-uid-generate-failed",
                                           errorMessage  : "Server Error"
                                          });
                            }            

                        sql_conn.query(sql_query_signup_google,[uid,name,email,gid,dp],function(err,result){

                            if(err)
                                {
                                    file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                                    res.json({success       : "false",
                                              errorID       : "query-failed",
                                              errorMessage  : "Server Error"
                                             });
                                }else
                                {
                                   res.json({success : "true",
                                             message : "Successfully Signed Up"
                                            });
                                }
                        });//end of query
                    }else
                    {
                        res.json({success       : "false",
                                  errorID       : "query-failed",
                                  errorMessage  : "Server Error"
                                }); 
                    }                            
        }else //facebook
        {
            
        }
        
    
} 

global.emailVerify = function(email)
{    
    var email_result;     
    sql_conn.query(sql_query_verify_email,email,function(err,result){                
                if(err)
                    {
                        file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                        email_result = {success       : "false",
                                        errorID       : "query-failed"
                                       };                             
                    }else if(result.length==1)
                        {
                            email_result =  {success : "true"};                                                

                        }else
                        {
                            email_result = {success : "false"};                          
                        }
            });//end of query
        
    while(!email_result){require('deasync').sleep(10);};            
    return email_result;
}