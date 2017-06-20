var sql_query_fetch = `SELECT i.AID as AID,i.details as details,i.favouriteCount as favourite,i.downloadCount as download,i.viewCount as view,
                      i.tags as tags FROM featured_popular as f,images as i WHERE f.type="featured" AND f.image_AID=i.AID `;

w1.on(`listFeatured`,function(req,res){

    sql_conn.query(sql_query_fetch,function(err,result){
        if(err)
        {
            response = {success       :"false",
                        errorID       : "query-failed",
                        errorMessage  : "Server Error"
                        };  
            res.json(response);
            file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
        }else
        {            
            var images_list = [];
            var image_details;

            for (var i = 0; i < result.length; i++) {
                image_details = {AID            : result[i].AID,
                                 details        : result[i].details,
                                 favouriteCount : result[i].favourite,
                                 downloadCount  : result[i].download,
                                 viewCount      : result[i].view,
                                 tags           : result[i].tags
                                };
                images_list.push(image_details);
            }

            res.json({success : "true",
                      images  : images_list
                    });

            images_list = [];
        }
    });//end of query
});//end of w1 listFeatured