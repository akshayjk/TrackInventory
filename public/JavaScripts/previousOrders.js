/**
 * Created by sakshamgrover on 20/04/15.
 */



$(document).ready(function () {
    var orderDetails= {
        "details": [{
            "order":[{
                "Students": [
                    {
                        "NameOfStudent": "Akshay6",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 10,
                        "UniformQty": 2
                    },
                    {
                        "NameOfStudent": "Akshay7",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 10,
                        "UniformQty": 2
                    },
                    {
                        "NameOfStudent": "Akshay8",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 10,
                        "UniformQty": 2
                    }
                ],
                "FranchiseId": "35465464",
                "Status": "Ordered",
                "TotalAmount": 654354.55,
                "ModeOfPayment": "Cash",
                "TransactionID": "RR88283553",
                "Address": "Some detailed address here ",
                "OrderId": "4641429367824201",
                "CreateOn": "2015-04-18T14:37:04.211Z",
                "ModifiedOn": "2015-04-18T14:37:04.211Z"
            },
                {
                    "Students": [
                        {
                            "NameOfStudent": "Akshay6",
                            "RegistrationNumber": "AG887425",
                            "UniformSize": 10,
                            "UniformQty": 2
                        },
                        {
                            "NameOfStudent": "Akshay7",
                            "RegistrationNumber": "AG887425",
                            "UniformSize": 10,
                            "UniformQty": 2
                        },
                        {
                            "NameOfStudent": "Akshay8",
                            "RegistrationNumber": "AG887425",
                            "UniformSize": 10,
                            "UniformQty": 2
                        }
                    ],
                    "FranchiseId": "35465464",
                    "Status": "Ordered",
                    "TotalAmount": 654354.55,
                    "ModeOfPayment": "Cash",
                    "TransactionID": "RR88283553",
                    "Address": "Some detailed address here ",
                    "OrderId": "4641429367906931",
                    "CreateOn": "2015-04-18T14:38:26.943Z",
                    "ModifiedOn": "2015-04-18T14:38:26.943Z"
                }]
        }]
    };

        var orderData = orderDetails.details;
        console.log("@@@@@@@@@@@@@@@@@@@@ orderData @@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(orderData);
        var htmlData='';
        for (var i = 0; i < orderData.length; i++) {
            var validSummary = orderData[i].order;
            console.log(validSummary);
            $.each(validSummary,function () {

                htmlData += 'Got the data';
            });
        }
    console.log(htmlData);
    $("#ulorderDetails").html('');
    $("#ulorderDetails").html(htmlData);


})


