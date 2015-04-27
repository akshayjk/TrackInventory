/**
 * Created by Akshay on 27-04-2015.
 */
var express = require('express');
var router = express.Router();
var path = require('path');


//Application Modules
var requestData = require('../services/Util.js');
var LoginServices = require('../services/Login.js');



router.post('/login', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new LoginServices().login(req, res, body);
    })
});

module.exports = router;

