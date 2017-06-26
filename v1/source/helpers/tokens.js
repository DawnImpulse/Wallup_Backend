var privateKey      = path.resolve(__dirname,'..','./keys/wallup'),
    tokenVerifyLogs = path.resolve(__dirname,'..','..','..','./logs')+'/tokenVerifyLogs.txt',
    tokenLogs       = path.resolve(__dirname,'..','..','..','./logs')+'/tokenLogs.txt',
    tokenIssuer          = "Stonevire Technologies",
    checkTokenResponse,
    tokenGenerateResponse,
    tokenVerifyResponse,
    token;

global.generateToken = function(uid){
    
    try
    {
        token                   = jwt.sign({aud:uid,iss:tokenIssuer}, privateKey, { expiresIn: 365*24*60*60});    
        tokenGenerateResponse   = {success : "true",
                                   token   : token} ;
        return tokenGenerateResponse;
        
    }catch(err)
    {        
        console.log(err);
        file.appendFile(tokenLogs,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);}); 
        tokenGenerateResponse = {
                                 success        : "false",                                 
                                 errorID        : "token-generate-failed",
                                 errorName      : err
                                };
        return tokenGenerateResponse;
    }
    
};//generateToken function

global.verifyToken = function(tokenToCheck){
  
    
    try
    {
        tokenVerifyResponse = jwt.verify(tokenToCheck,privateKey);
        checkTokenResponse  = {
                                success : 'true',
                                uid     : tokenVerifyResponse.aud
                              };        
                        
        return checkTokenResponse;
        
    }catch(err)
    {
        console.log(err);
        file.appendFile(tokenVerifyLogs,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});             
        checkTokenResponse = {success     : "false",
                              errorID     : "token-verify-failed",
                              errorName   : err.name};

        return checkTokenResponse;
    }        
};//verifyToken function

    