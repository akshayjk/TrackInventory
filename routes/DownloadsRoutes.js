/**
 * Created by Akshay on 01-05-2015.
 */
var express = require('express');
var router = express.Router();
var path = require('path');


//Application Modules
var requestData = require('../services/Util.js');
var downloads = require('../services/Downloads.js');


router.get('/downloadFile', function(req, res){
    console.log("reached to download router")
    new requestData().getReqBody(req, res, function(body){
        new downloads().downloadFile(req, res, body);
    })
});

router.get('/sampleAccounts', function(req, res){
    res.download(path.join(__dirname ,'../services/Samples/Accounts.xls'));
});

router.get('/sampleOrders', function(req, res){
    res.download(path.join(__dirname ,'../services/Samples/OrdersProtected.xls'));
});

router.get('/getKits', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new downloads().getKits(req, res, body);
    })
})

module.exports = router;