/**
 * Created by Akshay on 18-04-2015.
 */

var mongoUrl = "mongodb://127.0.0.1:27017/WebSite";
var StudentCollection = "STUDENTS";
var OrdersCollection = "ORDERS";

//Email Settings
var mandrill_key = 'iIpOPFN7FFPbGaWYCg74tQ';
var mailgun_key = "key-f324d24ba6a517c85ad77a726615904c";
var emailSender = "admin@littleeinsteins.co.in";
var emailAppearanceName = "Little Einsteins";
var WelcomeTemplate = '/EmailTemplates/LEWelcomeEmail.html';
var Registration_PasswordReset = './EmailTemplates/recoverPassword.html';
var mailgun_domain = "inventory.littleeinsteins.co.in"
var emailService = "mandrill";

exports.mongoUrl = mongoUrl;
exports.studentsCollection = StudentCollection;
exports.ordersCollection = OrdersCollection;

//email settings
exports.mandrill_key = mandrill_key;
exports.mailgun_key = mailgun_key;
exports.emailSender = emailSender;
exports.emailAppearanceName = emailAppearanceName;
exports.WelcomeTemplate = WelcomeTemplate;
exports.mailgun_domain = mailgun_domain;
exports.emailService = emailService;
exports.Registration_PasswordReset = Registration_PasswordReset;
