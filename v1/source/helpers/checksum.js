var checksum = require(`checksum`);
var bcrypt   = require('bcrypt');

var name = "STONEVIRETECHNOLOGIES",    
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    delta = "",
    UID,
    result;

global.generateUID = function()
{
    for(var i=0;i< name.length;i++)
    {
        var rand = Math.floor((Math.random() * possible.length));
        var bravo = possible.charAt(rand);
        delta+=bravo;
        var charlie = name.charAt(i);          
        var echo = ((parseInt(charlie.charCodeAt(0)) + parseInt(bravo.charCodeAt(0)))%65)%26;
        delta += possible.charAt(echo);        
    }
        
    try
    {
        UID = checksum(delta);
    }catch(err)
    {
        result = {success : "false",
                  errorID : "UID-checksum-failed"                
                 };
        return result;
    }
            
    result = {success   : "true",
              UID       : UID
             }
    
    return result;
}

global.hashing = function(key)
{    
    try
    {
        var hash = bcrypt.hashSync(key, 9); //9 is salt rounds
        return {success : "true",
                hash    : hash
               }; 
    }catch(err)
    {
        return {success : "false",
                errorID : "hashing-failed"
               };
    }
    
}

global.hashingVerify = function(key,hash)
{
    try
    {   
        var result = bcrypt.compareSync(key, hash);
        return {success : result.toString()};
    }catch(err)
        {
         return  {success : "false",
                  errorID : "hashing-verify-failed"
                 };
        }    
}