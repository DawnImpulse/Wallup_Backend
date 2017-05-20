global.file             = require('fs');
global.path             = require('path');
global.events           = require('events');
global.dateTme          = require('path');
global.jwt              = require('jsonwebtoken'),
global.express          = require('express'),
global.bodyParser       = require('body-parser'),
global.errorLogFile     = path.resolve(__dirname,'..','..','./logs') + '/errorLogs.txt';
global.exceptionLogFile = path.resolve(__dirname,'..','..','./logs')+'/exceptionLogs.txt';

global.w1 = new events.EventEmitter();
global.w2 = new events.EventEmitter();
global.w3 = new events.EventEmitter();
global.w4 = new events.EventEmitter();

global.app = express();