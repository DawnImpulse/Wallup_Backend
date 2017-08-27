
var page,
    per_page,
    client_id,
    upper_limit,
    lower_limit,
    details,
    id,
    access;

var response_array = [];

var unsplash_client_id = `a25247a07df2c569f6f3dc129f43b0eb3b0e3ff69b00d5b84dd031255e55b961`;

var sql_query           = `SELECT details FROM unsplash_trending ORDER BY aid DESC LIMIT ? `;
var sql_client_id       = `SELECT access FROM unsplash_user WHERE client_id = ? `;
var sql_insert          = `INSERT INTO unsplash_trending (id,details) VALUES(?,?) `;
var sql_client_req      = `SELECT requests FROM unsplash_user WHERE client_id = ?`;
var sql_client_req_upd  = `UPDATE unsplash_user SET requests = ? WHERE client_id = ?`;

w1.on('unsplash_trending',function(req,res){

    page        = req.query.page;
    per_page    = req.query.per_page;
    client_id   = req.query.client_id;

    if(typeof client_id =='undefined')
    {
        res.json({success : "false" , errorMessage : "Client ID not present"});
    }else
    {
        var client_id_response = clientIdCheck(client_id);
        if(client_id_response.success == "false")
        {
            res.json({success : "false", errorMessage : client_id_response.errorMessage});
        }else
        {            
            if(typeof page == 'undefined')
            {
                page = 1;
            }
    
            if(typeof per_page == 'undefined')
            {
                per_page = 30;
            }
                
            upper_limit = page * per_page;
            lower_limit = upper_limit - per_page;            
    
            //Querying DB for list of images
            sql_conn.query(sql_query,upper_limit,function(err,result){
    
                if(err)
                {
                    res.json({success : "false", errorMessage :"Error in SQL query of DB"});
                    console.log(err);
                }else
                {
                    if(upper_limit>result.length)
                    {
                        upper_limit = result.length;
                    }
    
                    for(var i=lower_limit;i<upper_limit;i++)  //Creating Image Json Object and pushing to Array
                    {
                        var parse_details = JSON.parse(result[i].details);
                        response_array.push(parse_details);
                    }
                        
                    res.json(response_array); //Response
    
                    response_array = [];
                }
            });

            client_id_counter(client_id);
            totals_counter();
        }                

    }

});//end of w1 unsplash trending


w1.on('unsplash_trending_insert',function(req,res){

    id      = req.query.id;
    token   = req.query.token;

    if(typeof id =='undefined')
    {
        res.json({success : "false" , errorMessage : "No id provided"});
    }else
    {
        if(typeof token =='undefined')
        {
            res.json({success : "false" , errorMessage : "Access token not present"});
        }else
        {
            if(token !== "22ahfnnnsiaaasjsdi")
            {
                res.json({success : "false" , errorMessage : "Access Denied"});
            }else
            {
                unsplashDetails(id,res);
            }
        }
    }
});


function clientIdCheck(client_id,res)
{
    var result1;

    sql_conn.query(sql_client_id,client_id,function(err,result){

        if(err)
        {
            result1 = {success:"false",errorMessage:"Client id query DB error"};            
        }else
        {
            if(result.length != 1)
            {
                result1 = {success:"false",errorMessage:"Incorrent Client ID"};
            }else
            {
                if(result[0].access == "false")
                    result1 = {success:"false",errorMessage:"Access Denied , kindly contact"};
                else
                    result1 = {success:"true"};
            }
        }
    });

    while(!result1){require('deasync').sleep(10);};
    return result1;
}

function unsplashDetails(id,res)
{
    request({
        uri:`https://api.unsplash.com/photos/`+id+`?client_id=`+unsplash_client_id,
        method : "GET",
    },function(error,result,body){
        if(error)
        {
            res.json({success : "false" , errorMessage : "Request Failed"});
            console.log(error);
        }
        else
        {
            var parsed = JSON.parse(body);
            if(parsed.hasOwnProperty(`errors`))
            {
                var errorArray = parsed.errors;
                res.json({success : "false",errorMessage : errorArray[0]});
            }else
            {            
                sql_conn.query(sql_insert,[id,body], function(err,result){
                    if(err)
                    {
                        res.json({success : "false" , errorMessage : "Insert query error"});                                           
                    }else
                    {
                        res.json({success: "true"});
                    }
                });
            }
        }
    });    
}

function client_id_counter(client_id)
{    
    var client_requests = -1;
    sql_conn.query(sql_client_req,client_id,function(err,result){

        if(err)
        {
            client_requests = -2;
            console.log(err);            
        }else
        {
            client_requests = result[0].requests;
        }
    });//end of query 1

    while(client_requests == -1){require('deasync').sleep(10);};    

    if(client_requests != -1)
    {                
        var temp = parseInt(client_requests);
        temp = temp + 1;
    
        sql_conn.query(sql_client_req_upd,[temp,client_id],function(err,result){
    
            if(err)
            {
                console.log(err);            
            }
        });   
    }
    
}

function totals_counter(client)
{
    file.readFile(totalRequests, 'utf8' , function(err,total_contents){
        if(err)
        {
            console.log(err);
        }else
        {
            var json;
            if(total_contents.length !== 0)
            {
                var c_moment = moment();
                var parse = JSON.parse(total_contents);
                
                var h  = parse.thishour + 1;
                var d  = parse.thisday + 1;
                var m  = parse.thismonth + 1;      
                var t  = parse.total + 1;

                json = {thishour : h , thisday : d,thismonth : m,total : t};
            }else
            {
                json = {thishour : 1, thisday : 1,thismonth : 1,total : 1};
            }
            
            file.writeFile(totalRequests,JSON.stringify(json),(err) =>{

                if(err)
                {
                    console.log(err);
                }
            });
        }
    });
}
