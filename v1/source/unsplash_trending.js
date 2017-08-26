
var page,
    per_page,
    client_id,
    upper_limit,
    lower_limit;

var response_array = [];

var sql_query       = `SELECT details FROM unsplash_trending ORDER BY aid DESC LIMIT ? `;
var sql_client_id   = `SELECT access FROM unsplash_user WHERE client_id = ? `;

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
        }                

    }

});//end of w1 unsplash trending

function clientIdCheck(client_id)
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