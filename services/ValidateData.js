/**
 * Created by Akshay on 8/11/2015.
 */


function ValidateData(){

}

ValidateData.prototype.validate = function(data,validObject,callback){
    var validKeys = Object.keys(validObject);
    for(var i=0;i<validKeys.length;i++){
        if(data[validKeys[i]]==undefined){
            callback(new Error(validKeys[i] + " is missing in input."))
            break;
        }
        validObject[validKeys[i]] = data[validKeys[i]];
    }
 callback(null,validObject);
}

module.exports = ValidateData;