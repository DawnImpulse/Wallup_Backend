var bitly           = require('bitly'),
    file            = require('fs'),
    path            = require('path'),
    mail            = require('nodemailer'),
    events          = require('events'),
    dateTime        = new Data(),
    errorLogFile    = path.resolve(__dirname,'..','..','./logs') + '/errorLogs.txt';

var receipents,
    subject,
    body,
    bcc,
    type,
    sourceImage,
    quality,
    UID,
    token;
    
require('tokens');

global.w4 = new events.EventEmitter();

w4.on('w4mail',function(req,res){
    
    sourceImage = req.body.sourceImage;
    quality     = req.body.quality;
    token       = req.body.token;
    type        = req.body.type;
    
    if(type === mail)
        {
            
        }else{
            
            
        }
})
    
    