var to,
    from,
    cc,
    bcc,
    replyTo,
    subject,
    body,
    attachments,
    mailOptions;

global.mailing = function(mailOptions){
    
    to          = mailOptions.to;
    from        = mailOptions.from;
    cc          = mailOptions.cc;
    bcc         = mailOptions.bcc;
    replyTo     = mailOptions.replyTo;
    subject     = mailOptions.subject;
    body        = mailOptions.body;
    attachments = mailOptions.attachments;
    
    mailOptions = {
        
            from : from,
            to : to,
            cc : cc,
            bcc : bcc,
            replyTo : replyTo,
            subject : subject,
            text : body,
            attachments : attachments,
        };


    switch(from)
    {
        case '"StoneVire Support" <support@stonevire.com>'    : 
                supportTransporter.sendMail(mailOptions, (err, info) => {
                    if (err) 
                    {                        
                        console.log(err); 
                        file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                    }
                    else
                    {
                        console.log('Message %s Sent: %s', info.messageId, info.response);   
                        file.appendFile(mailLogs,dateTime+" :: "+to+ ', '+info.messageId+', '+info.response+ "\n",
                                        function(err){console.log(err);});  
                    }
	           });
            break;
    }
    
}