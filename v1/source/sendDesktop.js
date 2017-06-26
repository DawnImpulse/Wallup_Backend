var receipents,
    subject,
    body,
    bcc,
    type,
    sourceImage,
    quality,
    uid,
    email,
    name,
    token,
    tokenVerifyResponse,
    bitlyShortenResponse,
    mailObject,
    imagePath,
    sqlQuery = "select email,name from users where uid = ?";

w4.on('w4mail',function(req,res){
    
    sourceImage = req.body.sourceImage;
    quality     = req.body.quality;
    token       = req.body.token;
    type        = req.body.type;
    
    switch(quality)
    {
        case "HQ"       : imagePath = stonevireHQ;break;
        case "HD"       : imagePath = stonevireHD;break;
        case "FHD"      : imagePath = stonevireFHD;break;
        case "2k"       : imagePath = stonevire2k;break;
        case "4k"       : imagePath = stonevire4k;break;
        case "Original" : imagePath = stonevireOriginal;break;                  
    }            
    
    if(type === bitly)
        {
            bitlyShortenResponse = bitlyShorten(imagePath+sourceImage);
            
            if(bitlyShortenResponse.success == "true")
                {
                    res.json({success :"true",
                              shortUrl:bitlyShortenResponse.shortUrl});
                }
            else
            {
                res.json({success       : "false",
                          errorId       : "sendDesktop.w4mail.bitlyError",
                          errorMessage  : "Bitly Url Shorten Failed"});    
            }
        }else{
            
            tokenVerifyResponse = verifyToken(token);
            
            if(tokenVerifyResponse.success === true)
                {
                    wait.for(sql_conn.query(sqlQuery,tokenVerifyResponse.uid,function(err,result){                
                        email   = result.email;
                        name    = result.name;
                    }));
                    
                    mailObject = {
                        from : '"StoneVire Support" <support@stonevire.com>',
                        to  : email;
                        bcc : '',
                        cc  : '',
                        replyTo : '"StoneVire Contact" <contact@stonevire.com>',
                        subject : "Image",
                        text : " Here is your image",
                        attachments : [{path:imagePath+sourceImage}] //path to file
                    };
                    
                }else
                {
                    if(tokenVerifyResponse.errorName == "TokenExpiredError")
                    {
                        //regenerate Token 
                        //Calls itself again
                    }
                    else 
                    { 
                        res.json({success   :"false",
                                  errorId   :"sendDesktop.w4mail.tokenInvalid",
                                  errorName :"Token Verification Failed Completely"})
                    }            
                }
            
        }
})
    
    