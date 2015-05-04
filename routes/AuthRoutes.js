/**
 * Created by Akshay on 27-04-2015.
 */
var express = require('express');
var router = express.Router();
var path = require('path');


//Application Modules
var requestData = require('../services/Util.js');
var AuthenticationServices = require('../services/Authentication.js');


router.post('/login', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new AuthenticationServices().login(req, res, body);
    })
});

router.post('/account', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new AuthenticationServices().createAccount(req, res, body);
    })
});

router.get('/account', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new AuthenticationServices().getAccounts(req, res, body);
    })
});

router.get('/FranchiseList', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new AuthenticationServices().getFranchiseNameList(req, res, body);
    })
});

router.delete('/account', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new AuthenticationServices().deleteAccount(req, res, body);
    })
});

module.exports = router;

