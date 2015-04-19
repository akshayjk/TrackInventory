/**
 * Created by Akshay on 18-04-2015.
 */

var Students ={
    "NameOfStudent": "Akshay4",
    "Class": "2nd",
    "Age": 10,
    "ParentName": "Parent1",
    "ParentContact": 65468753,
    "ParentEmail": "Another@something.com",
    "UniformSize": 10,
    "UniformQuantity": 2,
    "DateOfAdmission": "ISO Date Format",
    "RegistrationNumber": "AG887425",
    "ReceiptNumber": "RR2478754",
    "OrderId": "werf64687",
    "FranchiseId": "uhuhk8654"
}

var Orders ={
    "OrderId": "MM0098",
    "Students": [
        {
            "StudentName": "SomeName",
            "Uniform Size": 10,
            "UniformQty": 2
        }
    ],
    "FranchiseId": "35465464",
    "Status": "Ordered",
    "TotalAmount": 654354.55,
    "ModeOfPayment": "Cash",
    "TransactionID": "RR88283553",
    "Address": "Some detailed address here "
}

var Messages ={
    "From":String,
    "FranchiseId":String,
    "MessageChain":[
        {
            "From":String,
            "CreatedOn":Date,
            "Message":String,
            "Status":String,
            "MessageId":String
        }
    ]
}