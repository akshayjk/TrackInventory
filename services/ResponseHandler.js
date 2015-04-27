//will send the response

function ResponseHandler(){

}

ResponseHandler.prototype.sendResponse = function(req, res, resMsg, StatusCode){
	//Sends the response message and response code
	if(!StatusCode)
		StatusCode = 200;
	res.status(StatusCode);
	res.setHeader("Content-Type", "application/json");
	if(typeof(resMsg)=="obejct")
		resMsg = JSON.stringify(resMsg);
	res.send(resMsg);
};

module.exports = ResponseHandler;