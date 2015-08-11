/**
 * Created by Akshay on 27-04-2015.
 */
var express = require('express'),
    router = express.Router(),
    path = require('path'),
    validate = require('../services/ValidateData.js'),
    define = require('../services/Define.js'),
    responseHandler = require('../services/ResponseHandler.js');


//Application Modules
var requestData = require('../services/Util.js');
var AuthenticationServices = require('../services/Authentication.js');


router.post('/login', function (req, res) {
    new requestData().getReqBody(req, res, function (body) {
        new validate().validate(body,define.validLogin,function(err,body){
            if(!err){
                new AuthenticationServices().login(req, res, body);
            }else{
                new responseHandler().sendResponse(req, res, "error",err,403);
            }
        })

    })
});

router.post('/account', function (req, res) {
    new requestData().getReqBody(req, res, function (body) {
        new AuthenticationServices().createAccount(req, res, body);
    })
});

router.get('/account', function (req, res) {
    new requestData().getReqBody(req, res, function (body) {
        new AuthenticationServices().getAccounts(req, res, body);
    })
});

router.get('/FranchiseList', function (req, res) {
    new requestData().getReqBody(req, res, function (body) {
        new AuthenticationServices().getFranchiseNameList(req, res, body);
    })
});

router.delete('/account', function (req, res) {
    new requestData().getReqBody(req, res, function (body) {
        new AuthenticationServices().deleteAccount(req, res, body);
    })
});

router.get('/verify', function (req, res) {
    new requestData().getReqBody(req, res, function (body) {
        new AuthenticationServices().verify(req, res, body);
    })
});

router.post('/registerAccount', function (req, res) {
    new requestData().getReqBody(req, res, function (body) {
        new AuthenticationServices().register(req, res, body);
    })
});

module.exports = router;

