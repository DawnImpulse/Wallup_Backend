var express      = require('express'),
bodyParser       = require('body-parser'),
path             = require('path'),
fs               = require('fs'),
responseObject,
dateTime         = new Date();
app              = express(),
router           = express.Router(),
port             = process.env.PORT || 7020,
exceptionLogFile = path.resolve(__dirname,'..','..','./logs')+'/exceptionLogs.txt';

require('./listNewImages.js');
require('./listCollections.js');
require('./listPopular.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ROUTES FOR OUR API
// =============================================================================


//GET--------------------
router.get('/listCollections', function(req, res) { responseObject = res; w2.emit('w2fetch',req,res);});
router.get('/listFeatured', function(req, res) {});

//POST-------------------
router.route('/listNewImages').post(function(req,res){ responseObject = res; w1.emit('w1fetch',req,res);});
router.route('/listPopular').post(function(req,res){ responseObject = res; w3.emit('w3fetch',req,res);});
router.route('/sendDesktop').post(function(req,res){});
router.route('/subscribeDesktop').post(function(req,res){});
router.route('/addUpdateUser').post(function(req,res){});
router.route('/addImage').post(function(req,res){});
router.route('/modifyImageDetails').post(function(req,res){});
router.route('/userLoginSignup').post(function(req,res){});
router.route('/getIndividualCollection').post(function(req,res){});
router.route('/getIndividualImage').post(function(req,res){});
router.route('/getSimilarImages').post(function(req,res){});


// =============================================================================
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    fs.appendFile(exceptionLogFile,dateTime + " :: " +err+"\n",function(err){console.log(err);});
    
    responseObject.json({success      : "false",
                         errorId      : "uncaughtException",
                         errorMessage : "Server Side Exception"});
}); //Global Unchecked Exception Handler

app.use('/v1', router);
app.listen(port);
console.log('Magic happens on port ' + port);