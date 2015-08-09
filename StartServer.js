/**
 * Created by 290494 on 8/20/2014.
 */

// Node Modules
var express = require('express'),
    app = express(),
    fs = require('fs'),
    path = require('path'),
    node_xj = require("xls-to-json"),
    multer = require('multer');
var upload = multer({ dest: 'uploadTemp/'})

//App Modules
var dataBase = require('./services/DbOperations.js');

//App Routers
var Orders = require('./routes/OrderRoutes.js'),
    Inventory = require('./routes/InventoryRoutes.js'),
    Messages = require('./routes/MessagesRoutes.js'),
    Login = require('./routes/AuthRoutes.js'),
    Download = require('./routes/DownloadsRoutes.js'),
    BulkOperations = require('./services/BulkOperations.js');

app.use(express.static(path.join(__dirname + '/public')));

console.log("Connecting to Database");

new dataBase().connect();

//Index Page Gateway
app.get('/Login', function (req, res) {
    res.sendFile(path.join(__dirname, '/Login.html'));
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/Login.html'));
});

app.use('/order', Orders);
app.use('/inventory', Inventory);
app.use('/auth', Login);
app.use('/download', Download);
//app.use('/messages', Messages);


//for the file  uploads
var type = upload.single('file');

app.post('/upload', type, function (req,res) {
    console.log("post req received ")
    var tmp_path = req.file.path;
    var target_path = __dirname + '/uploads/' + req.file.originalname;
    var filename = req.file.originalname;
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() {
        fs.unlink('./uploadTemp/'+req.file.filename,function(){
            console.log("File has been deleted.")
        })

        if(getExtension(filename) == ".xls"){
            console.log("converting to JSON")
            node_xj({
                input: __dirname + '/uploads/' + filename,
                output: __dirname + '/uploads/' + "output.json"
            }, function (err, result) {
                if (err) {
                    console.log("error", err);
                } else {
                    console.log("bulk operations")
                    new BulkOperations().findOperation(req, res, result)
                }
            })
        }else{
            console.log("sending the response for invalid file")
            res.status(404);
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify({success:false,errorMessage:"Only file with xls extension are supported. Please download a sample file from Instructions Tab and re-upload after filling the same."}))
        }


        function getExtension(filename) {
            var i = filename.lastIndexOf('.');
            console.log("extension here " + filename.substr(i))
            return (i < 0) ? '' : filename.substr(i);
        }
    });
    src.on('error', function(err) { res.send('error'); });
    //res.send("done")

});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send('error : ' + JSON.stringify({message: err.message, error: err}));
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.listen(9000);
