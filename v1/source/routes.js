require('./helpers/globalVars.js');
require('./helpers/tokens.js');
require('./helpers/mysqlConn.js');
require('./helpers/mailer.js')

require('./listNewImages.js');
require('./listCollections.js');
require('./listPopular.js');
require('./addImage.js');

var url = require('url');
var multer = require('multer');

var router           = express.Router(),
    router1          = express.Router(),
    port             = process.env.PORT || 7020,
    responseObject;

var body_urlencode = bodyParser.urlencoded({ extended: true });
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({storage:storage});

//GET Requests--------------------
router.get('/v1/listCollections', function(req, res) { responseObject = res; w2.emit('w2fetch',req,res);});
router.get('/v1/listFeatured', function(req, res) {});

router.get('*',function(req,res){ res.json({name:req.query.name});});

//POST Requests-------------------
router.route('/v1/listNewImages').post(body_urlencode,function(req,res){ responseObject = res; w1.emit('w1fetch',req,res);});
router.route('/v1/listPopular').post(body_urlencode,function(req,res){ responseObject = res; w3.emit('w3fetch',req,res);});
router.route('/v1/sendDesktop').post(body_urlencode,function(req,res){});
router.route('/v1/subscribeDesktop').post(body_urlencode,function(req,res){});
router.route('/v1/addUpdateUser').post(body_urlencode,function(req,res){});
router.route('/v1/modifyImageDetails').post(body_urlencode,function(req,res){});
router.route('/v1/userLoginSignup').post(body_urlencode,function(req,res){});
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
    
    if(responseObject.headersSent)
    {
        console.log('Headers-Sent');
    }else
        {
            responseObject.json({success      : "false",
                         errorId      : "uncaughtException",
                         errorMessage : "Server Side Exception"});   
        }
}); //Global Unchecked Exception Handler


var hee = path.resolve(__dirname,'..','..','..','./images');
app.use('/', router);
//app.use(express.static(hee),router1);
/*app.use('*',function(req,res)
{
 res.json({name:req.originalUrl})   ;
});*/

app.listen(port);
console.log('Magic happens on port ' + port);