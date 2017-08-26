require('dotenv').config();
require('./helpers/globalVars.js');
require('./helpers/tokens.js');
require('./helpers/mysqlConn.js');
require('./helpers/mailer.js');
require('./helpers/checksum.js');

require('./listNewImages.js');
require('./listCollections.js');
require('./listPopular.js');
require('./login.js');
require('./addImage.js');
require('./modifyImageDetails.js');
require('./listFeatured.js');
require('./taggingList.js');
require('./listCategoryCollectionName.js');
require('./unsplash_user.js');
require('./unsplash_trending.js');

var url     = require('url');
var multer  = require('multer');
var cors    = require('cors');

var router           = express.Router(),
    router1          = express.Router(),
    port             = process.env.PORT || 7091,
    responseObject;

var body_urlencode   = bodyParser.urlencoded({ extended: true });
var storage          = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload           = multer({storage:storage});

app.use(cors());

//GET Requests--------------------
router.get('/v1/listCollections', function(req, res) { responseObject = res; w2.emit('w2fetch',req,res);});
router.get('/v1/listFeatured', function(req, res) { responseObject = res; w1.emit('listFeatured',req,res)});
router.get('/v1/taggingList',function(req,res){ responseObject = res; w1.emit('taggingList',req,res)});
router.get('/v1/listCategoryCollectionNames',function(req,res){ responseObject = res; w1.emit('listCategoryCollectionName',req,res)});

router.get('/live',function(req,res){ responseObject = res ; res.json({name : req.query.name})});
router.get('/count',function(req,res){ responseObject = res ; countImages(res)});

//Unsplash User Login
router.get('/unsplash',function(req,res){

    responseObject = res ;
    
            //Query Params Present
            if(Object.keys(req.query).length !== 0)
            {
                w1.emit('unsplash_user',req,res);
            }else //Empty Query
            {
                res.sendFile(__dirname + '/login.html');
            } 
});

//Unsplash User Register
router.get('/unsplash_register',function(req,res){
    responseObject = res;
    res.sendFile(__dirname + '/register.html');
});

//Unsplash Documentation
router.get('/unsplash_documentation',function(req,res){
    responseObject = res;
    res.sendFile(__dirname + '/documentation.html');
});

//Unsplash Trending Images
router.get('/unsplash_trending',function(req,res){
    responseObject = res;
    w1.emit('unsplash_trending',req,res);
});

//Unsplash Trending Insert
router.get('/unsplash_trending_insert',function(req,res){

    responseObject = res;
    w1.emit('unsplash_trending_insert',req,res);
});

//router.get('*',function(req,res){ res.json({name:req.query.name});});

//POST Requests-------------------
router.route('/v1/listNewImages').post(body_urlencode,function(req,res){ responseObject = res; w1.emit('w1fetch',req,res);});
router.route('/v1/listPopular').post(body_urlencode,function(req,res){ responseObject = res; w3.emit('w3fetch',req,res);});
router.route('/v1/sendDesktop').post(body_urlencode,function(req,res){});
router.route('/v1/subscribeDesktop').post(body_urlencode,function(req,res){});
router.route('/v1/addUpdateUser').post(body_urlencode,function(req,res){});
router.route('/v1/modifyImage').post(body_urlencode,function(req,res){responseObject = res; w8.emit('w8modifyImage',req,res);});
router.route('/v1/login').post(body_urlencode,function(req,res){ responseObject = res; w9.emit('w9login',req,res);});
router.route('/v1/getIndividualCollection').post(body_urlencode,function(req,res){});
router.route('/v1/getIndividualImage').post(body_urlencode,function(req,res){});
router.route('/v1/getSimilarImages').post(body_urlencode,function(req,res){});

router.route('/v1/addImage').post(upload.single('image'),function(req,res){
    if (req.file) {
        console.dir(req.file);
        responseObject=res;
        w7.emit('w7tableEntry',req,res,req.file.originalname);
        }
    else
        {
         res.json({success: 'false',
                   errorId: 'addImage.upload',
                   errorMessage: 'Error In Image Insertion - Missing Image'
                  });   
        }
});
router.route('/test1').post(function(req,res){ });
router.route('/test2').post(function(req,res){ });

//router1.get('*',function(req,res){ res.json({name:req.query.name});});

//------------------------
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    file.appendFile(exceptionLogFile,dateTime + " :: " +err+"\n",function(err){console.log(err);});
    
    if(responseObject)
    {
        if(responseObject.headersSent)
            {
                console.log('Headers-Sent');
            }else
                {
                    responseObject.json({success      : "false",
                                        errorId      : "uncaughtException",
                                        errorMessage : "Server Side Exception"});   
                }
    }
    
}); //Global Unchecked Exception Handler


var hee = path.resolve(__dirname,'..','..','..','./images');
app.use('/wallup', router);
//app.use(express.static(hee),router1);
/*app.use('*',function(req,res)
{
 res.json({name:req.originalUrl})   ;
});*/

app.listen(port);
console.log('Magic happens on port ' + port);