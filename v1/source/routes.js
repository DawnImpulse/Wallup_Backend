var express     = require('express'),
bodyParser      = require('body-parser'),
app             = express(),
router          = express.Router(),
port            = process.env.PORT || 8071;   

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ROUTES FOR OUR API
// =============================================================================


//GET--------------------
router.get('/listCollections', function(req, res) {});
router.get('/listFeatured', function(req, res) {});

//POST-------------------
router.route('/listNewImages').post(function(req,res){});
router.route('/listPopular').post(function(req,res){});
router.route('/sendDesktop').post(function(req,res){});
router.route('/subscribeDesktop').post(function(req,res){});
router.route('/addUpdateUser').post(function(req,res){});
router.route('/addImage').post(function(req,res){});
router.route('/modifyImageDetails').post(function(req,res){});
router.route('/userLoginSignup').post(function(req,res){});
router.route('/getIndividualCollection').post(function(req,res){});
router.route('/getIndividualImage').post(function(req,res){});


// =============================================================================
app.use('/v1', router);
app.listen(port);
console.log('Magic happens on port ' + port);