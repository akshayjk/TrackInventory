/**
 * Created by Akshay on 27-04-2015.
 */


function UtilityFunctions(){

}

UtilityFunctions.prototype.getReqBody = function(req, res, callback){
    var body = "";
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {

        var parsedBody;
        if(body==""){
            parsedBody=body;
            callback(parsedBody);
        }else{
            try{
                parsedBody = JSON.parse(body);
            }catch(e){
                var response = {
                    "success": false,
                    "errorMessage": "Invalid request JSON"
                };
                res.status(400);
                res.setHeader("Content-Type", "application/json");
                res.send(JSON.stringify(response));
            }
            callback(parsedBody);
        }


    });
}


module.exports = UtilityFunctions;