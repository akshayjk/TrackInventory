/**
 * Created by Akshay on 27-04-2015.
 */

var express = require('express');
var router = express.Router();
var path = require('path');


//Application Modules
var requestData = require('../services/Util.js');
var InventoryServices = require('../services/Inventory.js');


router.get('/status', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new InventoryServices().getStatus(req, res, body);
    })
});

router.post('/item', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new InventoryServices().addItem(req, res, body);
    })
});

router.put('/item', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new InventoryServices().updateItem(req, res, body);
    })
});

router.delete('/item', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new InventoryServices().deleteItem(req, res, body);
    })
});

router.get('/kit', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new InventoryServices().getKits(req, res, body);
    })
});

router.post('/kit', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new InventoryServices().addKit(req, res, body);
    })
});

router.put('/kit', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new InventoryServices().updateKit(req, res, body);
    })
});

router.delete('/kit', function(req, res){
    new requestData().getReqBody(req, res, function(body){
        new InventoryServices().deleteKit(req, res, body);
    })
});


module.exports = router;

