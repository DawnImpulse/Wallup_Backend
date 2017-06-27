var sql_query_category   = `SELECT DISTINCT name FROM collection where type="category"`;
var sql_query_collection = `SELECT DISTINCT name FROM collection where type="collection"`;

w1.on('listCategoryCollectionName',function(req,res)
{
    if(req.query.type === "category")
    {
        sql_conn.query(sql_query_category,function(err,result){
            if(err) //query error
                    {
                        file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                        res.json({success       : "false",
                                  errorID       : "query-failed",
                                  errorMessage  : "Server Error"
                                 });
                    }else
                    {
                        var list = [];
                        for(var i=0;i<result.length;i++)
                        {
                            list.push(result[i].name);
                        }
                        res.json({success : "true",
                                  message : "Successful Data Return",
                                  names   : list});
                        list = [];
                    }
        });//end of query
    }else if(req.query.type === "collection")
            {
               sql_conn.query(sql_query_collection,function(err,result){
                    if(err) //query error
                        {
                            file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                            res.json({success       : "false",
                                      errorID       : "query-failed",
                                      errorMessage  : "Server Error"
                                    });
                        }else
                        {
                            var list = [];
                            for(var i=0;i<result.length;i++)
                            {
                                list.push(result[i].name);
                            }
                            res.json({success : "true",
                                      message : "Successful Data Return",
                                      names   : list});
                            list = [];
                        }
                });//end of query 
            }
});//w1 end