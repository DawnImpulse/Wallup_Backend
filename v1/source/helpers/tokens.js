var privateKey      = path.resolve(__dirname,'..','./keys/wallup'),
    tokenVerifyLogs = path.resolve(__dirname,'..','..','..','./logs')+'/tokenVerifyLogs.txt',
    tokenLogs       = path.resolve(__dirname,'..','..','..','./logs')+'/tokenLogs.txt',
    tokenIssuer          = "Stonevire Technologies",
    checkTokenResponse,
    tokenGenerateResponse,
    token;

global.generateToken = function(UID,AID){
    
    try
    {
        token                   = jwt.sign({aud:UID,iss:tokenIssuer}, privateKey, { expiresIn: 365*24*60*60});    
        tokenGenerateResponse   = {success:'true',token:token} ;
        return tokenGenerateResponse;
        
    }catch(err)
    {        
        console.log(err);
        file.appendFile(tokenLogs,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);}); 
        tokenGenerateResponse = {success:'false',error:err} ;
        return tokenGenerateResponse;
    }
    
};//generateToken function

global.verifyToken = function(tokenToCheck){
  
    jwt.verify(tokenToCheck, privateKey, function(err, decoded) {
        if (err)
            {            
                console.log(err);
                file.appendFile(tokenVerifyLogs,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});             
                checkTokenResponse = {success : 'false',
                                      errorName : err.name};
                
                return checkTokenResponse;
            
            }else
            {
                checkTokenResponse = {success : 'true',
                                      UID:decoded.aud};
                
                return checkTokenResponse;
            }

        
    });//end of jwt verify
    
};//verifyToken function

    