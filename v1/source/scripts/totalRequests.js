var path             = require('path');
var totalRequests    = path.resolve(__dirname,'..','..','..','./logs')+'/totalRequestsTime.txt';
var totalRequestsC   = path.resolve(__dirname,'..','..','..','./logs')+'/totalRequests.txt';
var file             = require('fs');
var moment           = require('moment');
var request          = require('request');

var webhook = "https://hooks.slack.com/services/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";
var readJSON ;
var writeJSON ;

var sleep_time;
var fileReadEnd = -1;

var main_moment = moment();

while(1)
{
    file.readFile(totalRequests,function(err,result){
        
        if(err)
        {
            console.log(err);
            fileReadEnd = -2;
        }else
        {
            if(result.length !== 0)
            {
                var parsed  = JSON.parse(result);            
                var c_moment = moment();                
    
                if(c_moment.isSameOrAfter(parsed.nexthour))
                {
                    //sendResponse("Hour");
                    writeTotals("Hour");
                    temp = moment;
                    parsed.nexthour = temp(parsed.nexthour).add(1,'h').format();
                }
    
                if(c_moment.isSameOrAfter(parsed.nextday))
                {
                    sendResponse("Day");
                    writeTotals("Day");
                    var temp = moment;
                    parsed.nextday = temp(parsed.nextday).add(1,'d').format();
                }
    
                if(c_moment.isSameOrAfter(parsed.nextmonth))
                {
                    sendResponse("Month");
                    writeTotals("Month");
                    var temp = moment;
                    parsed.nextmonth = temp(parsed.nextmonth).add(1,'M').format();
                }
                       
                writeJSON = parsed;
                var temp_m = moment;      
                sleep_time = temp_m(parsed.nexthour).format('x') -  moment().format('x');                              
                fileReadEnd = 1;
    
            }else
            {
                var h_moment = moment();
                var d_moment = moment();
                var m_moment = moment();
    
                h_moment.add(1,'h');
                d_moment.add(1,'d');
                m_moment.add(1,'M');
    
                var temp = {nexthour  : h_moment.format(),
                            nextday   : d_moment.format(),
                            nextmonth : m_moment.format()};
    
                writeJSON = temp;   
                var temp_m = moment; 
                sleep_time = temp_m(h_moment).format('x') -  moment().format('x');
                fileReadEnd = 1;
            }
            
        }
    });   
    
    while(fileReadEnd == -1){require('deasync').sleep(10);};
    
    if(fileReadEnd != -2)
    {
        fileReadEnd = -1;
        file.writeFileSync(totalRequests,JSON.stringify(writeJSON));    
        require('deasync').sleep(sleep_time);
    }   
}

function sendResponse(time)
{
    try
    {
        var file1 = file.readFileSync(totalRequestsC);   
        var request_this_time;     
        if(file1.length !== 0)
        {
            var parsed = JSON.parse(file1);
            readJSON = parsed;

            var time_title;
            if(time === "Hour")
            {
                time_title = "Hourly";
                request_this_time = parsed.thishour;
            }
        
            if(time === "Day")
            {
                time_title = "Daily";
                request_this_time = parsed.thisday;
            }
        
            if(time === "Month")
            {
                time_title = "Monthly";
                request_this_time = parsed.thismonth;
            }

            var myJSONObject = { "text" : "Trending API Requests",
            "attachments" :[
             {
                 "title"  : time_title + " Requests",
                 "fields" : [
                     {
                         "title" : "Requests last "+ time,
                         "value" : request_this_time,
                         "short" : "true"
                     },
                     {
                         "title" : "Total Requests",
                         "value" : parsed.total,
                         "short" : "true"
                     }
                 ]
             }
            ]}; //end of JSON


            request({
                url: webhook,
                method: "POST",
                json: true,
                body: myJSONObject
            }, function (error, response, body){                               
             if(error)
                 {
                     console.log(error);
                 }        
            });
    

        }//end of if
    
    }catch(err)
    {
        console.log(err);
    }
    
    
    
    
    
}

function writeTotals(time)
{
    try{        

        var temp_json;        
        if(time === "Hour")
        {
            temp_json = {thishour   : 0,
                         thisday    : readJSON.thisday,
                         thismonth  : readJSON.thismonth,
                         total      : readJSON.total};
        }

        if(time === "Day")
        {
            temp_json = {thishour   : readJSON.thishour,
                         thisday    : 0,
                         thismonth  : readJSON.thismonth,
                         total      : readJSON.total};
        }

        if(time === "Month")
        {
            temp_json = {thishour   : readJSON.thishour,
                         thisday    : readJSON.thisday,
                         thismonth  : 0,
                         total      : readJSON.total};
        }

        file.writeFileSync(totalRequestsC,JSON.stringify(temp_json));

    }catch(err)
    {
        console.log(err);
    }    
}