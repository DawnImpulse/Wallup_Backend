require('json');
var sqlInsert = "insert into images(name,details,tags) values (?,?,?)";
var cameraMake,
    cameraModel,
    shutterSpeed,
    aperture,
    focalLength,
    iso,
    authorLink,
    authorImage,
    authorName,
    detailsJson,
    detailsExist,
    tags,
    params;
    
w7.on('w7tableEntry',function(req,res,originalName){
    
    detailsExist = req.body.detailsExist;
    tags            = req.body.tags;
    
    if(detailsExist === 'true')
    {
        cameraMake      = req.body.cameraMake;
        cameraModel     = req.body.cameraModel;
        shutterSpeed    = req.body.shutterSpeed;
        aperture        = req.body.aperture;
        focalLength     = req.body.focalLength;
        iso             = req.body.iso;
        authorName      = req.body.authorName;
        authorImage     = req.body.authorImage;
        authorLink      = req.body.authorLink;
    
        detailsJson = {"cameraMake"   : cameraMake,
                       "cameraModel"  : cameraModel,
                       "shutterSpeed" : shutterSpeed,
                       "aperture"     : aperture,
                       "focalLength"  : focalLength,
                       "iso"          : iso,
                       "authorName"   : authorName,
                       "authorImage"  : authorImage,
                       "authorLink"   : authorLink 
                      };
        
        params = [originalName,JSON.stringify(detailsJson),tags];   
    }else
        {
            params = [originalName,"",tags];
        }
    
    sqlConn.query(sqlInsert,params,function(err,result){
        
        if(err)
           {
                file.appendFile(errorLogFile,dateTime+" :: "+err+ "\n" ,function(err){console.log(err);});
                console.log(err);
                res.json({success      : "false",
                          errorID      : "addImage.w7tableEntry.insertImageDetails",
                          errorMessage : "Error In Inserting Image Details" }); //Response   
           }else{
               
               res.json({success:'true',
                         message:'Image Inserted Successfully'});
           }
    }); //end of sqlInsert
});//end of w7tableEntry