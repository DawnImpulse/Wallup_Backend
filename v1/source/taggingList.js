var sql_query = `SELECT AID,details FROM images WHERE tagged=0 LIMIT 10`;


w1.on("taggingList",function(req,res){
    sql_conn.query(sql_query,function(err,result){
        if(err)
        {
            response = {success       : "false",
                        errorID       : "query-failed",
                        errorMessage  : "Server Error"
                        };  
            file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
        }else
        {
            var list = [];
            for(var i=0;i<result.length;i++)
            {
                var images = {
                                AID     : result[i].AID,
                                details : result[i].details
                             };
                list.push(images);
            }

            res.json({success : "true",
                      message : "List Retrieved Successfully",
                      images  : list
                    });

            list = [];
        }
    })
});//w1 tagging List