/**
 * Created by Akshay on 18-04-2015.
 */
angular.module('franchiseMain', [])
    .controller('ExampleController', ['$scope', function ($scope) {
        $scope.master = {};

        $scope.update = function (user) {
            $scope.master = angular.copy(user);
        };

        $scope.reset = function () {
            $scope.user = angular.copy($scope.master);
        };

        $scope.reset();
    }]);

var val;
var bankval;
var Studentorder = {

    "Students": [
        {
            "NameOfStudent": "Akshay5",
            "Class": "2nd",
            "Age": 10,
            "ParentName": "Parent1",
            "ParentContact": 65468753,
            "ParentEmail": "Another@something.com",
            "UniformSize": 10,
            "UniformQty": 2,
            "DateOfAdmission": "ISO Date Format",
            "RegistrationNumber": "AG887425",
            "ReceiptNumber": "RR2478754"
        }
    ],
    "FranchiseId": "35465464",
    "FranchiseName":"SomeName",
    "TotalAmount": 654354.55,
    "ModeOfPayment": "Cash",
    "TransactionID": "RR88283553",
    "Address": "Some detailed address here "
};

$(document).ready(function () {
    // console.log("Student Data" + Studentorder);

    $('#PaymentTab').attr('class', 'disabled disabledTab');
    $('#OrderTab').attr('class', 'disabled disabledTab');

    $('#Next').click(function (event) {
        $('#OrderTab').attr('class', 'active');
        $('#StudentTab').attr('class', 'disabled disabledTab');
        $('#orange').show();
        $('#red').hide();

    });
    $('#Confirm').click(function (event) {
        $('#OrderTab').attr('class', 'disabled disabledTab');
        $('#PaymentTab').attr('class', 'active');
        $('#yellow').show();
        $('#orange').hide();
    });

    $('#logout').click(function (event) {

        parent.location='Login.html';
    });
    $('#placeOrder').click(function (event) {
        var bankval= validatebankForm();
        if (bankval)
        {
            var bankdata = {

                "FranchiseId": "Akshay123",
                "FranchiseName": "Kulkarni",
                "TotalAmount": 1000,
                "ModeOfPayment": document.getElementById("modePayment").value,
                "TransactionID": document.getElementById("bankTranID").value,
                "Address": document.getElementById("address").value



            }

            console.log("TransactionID" + bankdata.TransactionID);
            StudentOrderAdded(bankdata);


            }
    });


    $('#addMore').click(function (event) {
        val = validateForm();
        if (val) {
            var data = {

                "NameOfStudent": document.getElementById("childname").value,
                "Class": document.getElementById("selectClass").value,
                "Age": document.getElementById("classAge").value,
                "ParentName": document.getElementById("parentName").value,
                "ParentContact": document.getElementById("parentsContact").value,
                "ParentEmail": document.getElementById("parentEmail").value,
                "UniformSize": document.getElementById("uniformSize").value,
                "UniformQty": document.getElementById("uniformQuant").value,
                "DateOfAdmission": document.getElementById("Date").value,
                "RegistrationNumber": document.getElementById("regNum").value,
                "ReceiptNumber": document.getElementById("receiptNo").value

            }

        console.log("name" + data.NameOfStudent);
            studentAdded(data);

    }
    })



});

function studentAdded(data){
    Studentorder.Students.push(data);
    console.log("Student Data" + Studentorder.Students);
    document.getElementById("childname").value="";

      document.getElementById("classAge").value="";
       document.getElementById("parentName").value="";
        document.getElementById("parentsContact").value="";
      document.getElementById("parentEmail").value="";

        document.getElementById("uniformQuant").value="";
         document.getElementById("Date").value="";
        document.getElementById("regNum").value="";
     document.getElementById("receiptNo").value="";

}
function StudentOrderAdded(data){
    var callservicedata = [Studentorder.Students,data]
    console.log("Student Data" + callservicedata);

    alert("Your order has been placed. We will verify payment and get back soon");
    parent.location='FranchiseMain.html';

}


function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;

}

function validatebankForm() {
    var x = document.getElementById("modePayment");
    if (x.value == null || x.value == "") {
        alert("modePayment must be filled out");
        x.focus();
        return false;
    }
    var y = document.getElementById("bankTranID");
    if (y.value == null || y.value == "") {
        alert("bankTranID must be filled out");
        y.focus();
        return false;
    }
    var z = document.getElementById("address");
    if (z.value == null || z.value == "") {
        alert("address must be filled out");
        z.focus();
        return false;
    }
    return true;
}

function validateForm()
{
    var a=document.getElementById("childname");
    if (a.value==null || a.value=="") {
        alert("childname must be filled out");
        a.focus();
        return false;
    }
    var b=document.getElementById("classAge");
    if (b.value==null || b.value=="") {
        alert("classAge must be filled out");
        b.focus();
        return false;
    }
    var i=document.getElementById("parentName");
    if (i.value==null || i.value=="") {
        alert("parentName must be filled out");
        i.focus();
        return false;
    }
    var c=document.getElementById("parentsContact");
    if (c.value==null || c.value=="") {
        alert("parentsContact must be filled out");
        c.focus();
        return false;
    }

    var d=document.getElementById("parentEmail");
    if (d.value==null || d.value=="") {
        alert("parentEmail must be filled out");
        d.focus();
        return false;
    }
    var e=document.getElementById("uniformQuant");
    if (e.value==null || e.value=="") {
        alert("uniformQuant must be filled out");
        e.focus();
        return false;
    }
    var f=document.getElementById("Date");
    if (f.value==null || f.value=="") {
        alert("Date must be filled out");
        f.focus();
        return false;
    }
    var g=document.getElementById("regNum");
    if (g.value==null || g.value=="") {
        alert("regNum must be filled out");
        g.focus();
        return false;
    }
    var h=document.getElementById("receiptNo");
    if (h.value==null || h.value=="") {
        alert("receiptNo must be filled out");
        h.focus();
        return false;
    }
    return true;

}