/**
 * Created by sakshamgrover on 16/04/15.
 */
// Create a function to log the response from the Mandrill API
function log(obj) {
    $('#response').text(JSON.stringify(obj));
}

// create a new instance of the Mandrill class with your API key
var m = new mandrill.Mandrill('MVn7LWsiJLTbWaQLFJkvHg');

// create a variable for the API call parameters
var params = {
    "message": {
        "from_email":"akshayjk10@gmail.com",
        "to":[{"email":"grover.saksham@gmail.com"}],
        "subject": "Sending a text email from the Mandrill API",
        "text": "I'm learning the Mandrill API at Codecademy."
    }
};

function sendTheMail() {
// Send the email!

    m.messages.send(params, function(res) {
        log(res);
    }, function(err) {
        // log(err);
    });
}