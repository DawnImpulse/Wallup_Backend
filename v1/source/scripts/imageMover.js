var sql_decl        = require ('mysql');    
var sleep			= require ('system-sleep');
var request			= require('request');
var a;

var sql_conn = sql_decl.createConnection({
    host: "localhost",
    user: "root",
    database: "wallup",
    password: "Stone@0810@mysql#95"
});

sql_conn.connect(function(err){
    if(err)
    {
        console.log('Error Connecting DB');
        process.exit();
    }else
        {
            console.log('Connected to DB Successfully');
			a=1;
        }
});

while(!a){sleep(10)};

var request = require(`request`);
var value = 0,
	aid = [],
	sqlFinish0 = 0,
    sqlFinish1 = 0,
	tempImageResult,
	sqlFinish2 = 0,
	sqlFinish3 = 0,
	requestFinish = 0,
	parsedTemp,
	imageDetails,
	going = true,
	delId;


var readQuery  = `Select * from temp_image where aid=?`,
    writeQuery = `INSERT INTO images(id,details,author_url) values(?,?,?)`,
	deleteQuery= `Delete from temp_image where aid=?`;

sql_conn.query("select aid from temp_image",function(err,result){
	if(err)
	{
		process.exit();
	}else
	{
		for(var i=0;i<result.length;i++)
		{
			aid[i] = result[i].aid;
		}
		
		sqlFinish0 = 1;		
	}
});
while(sqlFinish0 == 0){sleep(10);};
for (var i = 0; i < 45; i++) 
{ 
	random = Math.floor((Math.random() * aid.length));	
	delId = aid[random];
    sql_conn.query(readQuery,delId, function (err, result) {
        if(err)        
        {
            console.log(err);			
        }else
        {						
            if(result.length==1)
            {				
				sqlFinish1 = 1;				
				tempImageResult = result[0].details;				
            }else
			{				
				sqlFinish1 = 2;
			}
        }
    });

	while(sqlFinish1 == 0){require('deasync').sleep(10);};		
	if(sqlFinish1==1)
	{		
		parsedTemp = JSON.parse(tempImageResult);
		request({
			uri:`https://api.unsplash.com/photos/`+parsedTemp.id+`?client_id=e1d86d6d0dcb8ce3eea9d16c712c0feed5f1e9a05e5a5f252cf5ea090a3ebc80`,
			method : "GET",
		},function(error,result,body){
			if(error)
			{
				requestFinish=2;
				console.log(error);
			}
			else
			{
				imageDetails = body;
				requestFinish=1;
			}
		});

		while(requestFinish==0){require('deasync').sleep(30);};		

		if(requestFinish==1)
		{
			var image_details_parsed = JSON.parse(imageDetails);
			var params = [parsedTemp.id,imageDetails,image_details_parsed.user.links.html];		
			sql_conn.query(writeQuery,params,function(err,result){
				if(err)
				{
					console.log(err);
					sqlFinish2==2;
				}else
				{										
					sqlFinish2=1;				
				}
			});

			while(sqlFinish2 == 0){require('deasync').sleep(10);};

			sql_conn.query(deleteQuery,delId,function(err,result){
				if(err){console.log(err)}
				else
				{
					value++;
					console.log("Done "+value);	
					sqlFinish3=1;
				}
			});

			while(sqlFinish3==0){sleep(10)};
		}else
		{
			console.log(`request error`);
		}		
	}else
	{		
		console.log(`Not Input`);
	}
	sqlFinish1=0;
	sqlFinish2=0;
	sqlFinish3=0;
	requestFinish=0;
}
