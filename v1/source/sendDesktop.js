var receipents,
    subject,
    body,
    bcc,
    type,
    sourceImage,
    quality,
    UID,
    token;

w4.on('w4mail',function(req,res){
    
    sourceImage = req.body.sourceImage;
    quality     = req.body.quality;
    token       = req.body.token;
    type        = req.body.type;
    
    if(type === bitly)
        {
            
        }else{
            
            
        }
})
    
    