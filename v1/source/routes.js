require('./helpers/globalVars.js');
require('./helpers/tokens.js');
require('./helpers/mysqlConn.js');
require('./helpers/mailer.js')

require('./listNewImages.js');
require('./listCollections.js');
require('./listPopular.js');

var mailp = {to:'saksham@stonevire.com',
             from:'"StoneVire Support" <support@stonevire.com>',
             bcc:'',
             cc:'',
             replyTo:'',
             subject:'Hey',
             body:'Yuppy',
             attachments:''}

var router           = express.Router(),
    port             = process.env.PORT || 7020,
    responseObject;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//GET Requests--------------------
router.get('/v1/listCollections', function(req, res) { responseObject = res; w2.emit('w2fetch',req,res);});
router.get('/v1/listFeatured', function(req, res) {});

//POST Requests-------------------
router.route('/v1/listNewImages').post(function(req,res){ responseObject = res; w1.emit('w1fetch',req,res);});
router.route('/v1/listPopular').post(function(req,res){ responseObject = res; w3.emit('w3fetch',req,res);});
router.route('/v1/sendDesktop').post(function(req,res){});
router.route('/v1/subscribeDesktop').post(function(req,res){});
router.route('/v1/addUpdateUser').post(function(req,res){});
router.route('/v1/addImage').post(function(req,res){});
router.route('/v1/modifyImageDetails').post(function(req,res){});
router.route('/v1/userLoginSignup').post(function(req,res){});
router.route('/v1/getIndividualCollection').post(function(req,res){});
router.route('/v1/getIndividualImage').post(function(req,res){});
router.route('/v1/getSimilarImages').post(function(req,res){});

router.route('/test1').post(function(req,res){ responseObject = res;mailing(mailp); res.json({success:true});});
router.route('/test2').post(function(req,res){ });

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

app.use('/wallup', router);
app.listen(port);
console.log('Magic happens on port ' + port);