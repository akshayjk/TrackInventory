/**
 * Created by 290494 on 8/20/2014.
 */

// Node Modules
var express = require('express'),
    app = express(),
    fs = require('fs'),
    path = require('path');

//App Modules
var dataBase = require('./services/DbOperations.js');

//App Roters
var Orders = require('./routes/OrderRoutes.js'),
    Inventory = require('./routes/InventoryRoutes.js'),
    Messages = require('./routes/MessagesRoutes.js'),
    Login = require('./routes/AuthRoutes.js'),
    Download = require('./routes/DownloadsRoutes.js')

app.use(express.static(path.join(__dirname + '/public')));

console.log("Connecting to Database");

new dataBase().connect();

//Index Page Gateway
app.get('/Login',function(req, res){
       res.sendFile(path.join(__dirname , '/loginNew.html'));
});

app.get('/LoginNew',function(req, res){
    res.sendFile(path.join(__dirname , '/starterTest.html'));
});

app.use('/order', Orders);
app.use('/inventory', Inventory);
app.use('/auth', Login);
app.use('/download', Download);
//app.use('/messages', Messages);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send('error : ' + JSON.stringify({message:err.message,error:err}));
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.listen(8000);
