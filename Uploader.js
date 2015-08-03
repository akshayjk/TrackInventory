
var express=require("express");

var app=express();
var multer  = require('multer');
var upload = multer({ dest: 'uploadABC/'});
var fs = require('fs');

/** Permissible loading a single file,
 the value of the attribute "name" in the form of "recfile". **/


app.get('/file', function(req, res){
    res.sendFile(__dirname +'/index.html')
})
var type = upload.single('recfile');

app.post('/upload', type, function (req,res) {
    console.log("post req received ")
    /** When using the "single"
     data come in "req.file" regardless of the attribute "name". **/
    var tmp_path = req.file.path;

    /** The original name of the uploaded file
     stored in the variable "originalname". **/
    var target_path = 'uploads/' + req.file.originalname;

    /** A better way to copy the uploaded file. **/
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() { res.send('complete'); });
    src.on('error', function(err) { res.send('error'); });
    //res.send("done")

});
/*Run the server.*/
app.listen(3000,function(){
    console.log("Working on port 3000");
});