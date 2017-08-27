global.file             = require('fs');
global.path             = require('path');
global.events           = require('events');
global.path             = require('path');
global.jwt              = require('jsonwebtoken'),
global.express          = require('express'),
global.bodyParser       = require('body-parser'),
global.nodemailer       = require('nodemailer'),
global.request		    = require('request'),
global.sleep            = require('system-sleep');
global.moment           = require('moment');
global.mailLogs         = path.resolve(__dirname,'..','..','..','./logs') + '/mailLogs.txt';
global.bitlyLogs        = path.resolve(__dirname,'..','..','..','./logs') + '/bitlyLogs.txt';
global.errorLogFile     = path.resolve(__dirname,'..','..','..','./logs') + '/errorLogs.txt';
global.exceptionLogFile = path.resolve(__dirname,'..','..','..','./logs')+'/exceptionLogs.txt';
global.totalRequests    = path.resolve(__dirname,'..','..','..','./logs')+'/totalRequests.txt';
global.imagesPath       = path.resolve(__dirname,'..','..','..','..','./resources/images');

global.w1 = new events.EventEmitter();
global.w2 = new events.EventEmitter();
global.w3 = new events.EventEmitter();
global.w4 = new events.EventEmitter();
global.w7 = new events.EventEmitter();
global.w8 = new events.EventEmitter();
global.w9 = new events.EventEmitter();

global.app      = express();
global.dateTime = new Date;

global.supportTransporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
	port: 465 ,
	secure: true, 
    auth: {
        user: 'support@stonevire.com',
        pass: 'Stone@0810@support#95'
    },
	tls: {
        rejectUnauthorized: false
    }
});