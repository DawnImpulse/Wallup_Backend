var Bitly = require('bitly'),
    bitly = new Bitly('4c2b0e312825fc528386006442a91a4994cfdd9a '),
    bitlyResponse;

 
global.bitlyShorten = function(shortUrl){

    bitly.shorten(shortUrl)
         .then(function(response) 
                {
                    var short_url = response.data.url;
                    bitlyResponse = {success:true,shortUrl:short_url}  ;
                    file.append(bitlyLogs,dateTime+" :: " short_url+ "\n",function(err){console.log(err);});
        
                    return bitlyResponse;
        
                }, function(error) 
                {
                    console.log(error);
                    file.appendFile(errorLogFile,dateTime+" :: "+error+ "\n" ,function(err){console.log(err);});                    
                    bitlyResponse = {success:'false',error:error};
        
                    return bitlyResponse;
                });
};
