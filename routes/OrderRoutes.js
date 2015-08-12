/**
 * Created by Akshay on 27-04-2015.
 */
var express = require('express');
var router = express.Router();

//Application Modules
var requestData = require('../services/Util.js');
var processOrders = require('../services/processOrders.js');

router.get('/orders', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new processOrders().getOrders(req, res, body);
    })
});

router.post('/orders', function(req, res){
   new requestData().getReqBody(req, res, function(body){
       new processOrders().placeOrder(req, res, body);
   })
});

router.put('/orders', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new processOrders().changeOrderStatus(req, res, body);
    })
})

router.get('/health', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new processOrders().getInventoryHealth(req, res, body);
    })
})

router.get('/next', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new processOrders().getInventoryHealth(req, res, body);
    })
})



module.exports = router;