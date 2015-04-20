/**
 * Created by sakshamgrover on 20/04/15.
 */



$(document).ready(function () {
    var orderDetails= [{


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
                "CreateOn": "15",
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
                    "Status": "pending",
                    "TotalAmount": 654354.55,
                    "ModeOfPayment": "Cash",
                    "TransactionID": "RR88283553",
                    "Address": "Some detailed address here ",
                    "OrderId": "4641429367906931",
                    "CreateOn": "12",
                    "ModifiedOn": "2015-04-18T14:38:26.943Z"


    }];


    var data = orderDetails;
   console.log("data"+data);
    var $table = $('#table');

    $(function () {
        $table.bootstrapTable({
            data: orderDetails
        });
     $table.bootstrapTable({
            height: getHeight()
        });

       $(window).resize(function () {
            $table.bootstrapTable('resetView', {
                height: getHeight()
            });
        });
    });
    function runningFormatter(value, row, index) {
        return index;
    }
   function operateFormatter(value, row, index) {
        return [
            '<a class="like" href="javascript:void(0)" title="Like">',
            '<i class="glyphicon glyphicon-heart"></i>',
            '</a>  ',
            '<a class="remove" href="javascript:void(0)" title="Remove">',
            '<i class="glyphicon glyphicon-remove"></i>',
            '</a>'
        ].join('');
    }
    window.operateEvents = {
        'click .like': function (e, value, row, index) {
            alert('You click like action, row: ' + JSON.stringify(row));
        },
        'click .remove': function (e, value, row, index) {
            $table.bootstrapTable('remove', {
                field: 'id',
                values: [row.id]
            });
        }
    };
    function actionFormatter(value, row, index) {
        return [
            '<a class="like" href="javascript:void(0)" title="Like">',
            '<i class="glyphicon glyphicon-heart"></i>',
            '</a>',
            '<a class="edit ml10" href="javascript:void(0)" title="Edit">',
            '<i class="glyphicon glyphicon-edit"></i>',
            '</a>',
            '<a class="remove ml10" href="javascript:void(0)" title="Remove">',
            '<i class="glyphicon glyphicon-remove"></i>',
            '</a>'
        ].join('');
    }

    window.actionEvents = {
        'click .like': function (e, value, row, index) {
            alert('You click like icon, row: ' + JSON.stringify(row));
            console.log(value, row, index);
        },
        'click .edit': function (e, value, row, index) {
            alert('You click edit icon, row: ' + JSON.stringify(row));
            console.log(value, row, index);
        },
        'click .remove': function (e, value, row, index) {
            alert('You click remove icon, row: ' + JSON.stringify(row));
            console.log(value, row, index);
        }
    };
    function totalTextFormatter(data) {
        return 'Total';
    }
    function totalNameFormatter(data) {
        return data.length;
    }
    function totalPriceFormatter(data) {
        var total = 0;
        $.each(data, function (i, row) {
            total += +(row.price.substring(1));
        });
        return '$' + total;
    }
    function getHeight() {
        return $(window).height() - $('h1').outerHeight(true);
    }


})


