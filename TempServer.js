/**
 * Created by 385382 on 4/22/2015.
 */
var express = require('express'),
    app = express(),
    fs = require('fs');

app.use(express.static(__dirname + '/public'));

app.get('/Login', function(req, res){
    res.sendFile(__dirname + "/login.html");
});

app.listen(3000);