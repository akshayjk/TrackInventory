/**
 * Created by Akshay on 8/10/2015.
 */



        if (body.Role.toUpperCase() == "ADMIN") {
            options.insertObject = body;
        } else {
            if (body.FranchiseDetails == undefined) {
                body.FranchiseDetails = {"UniformCosts": {"1": 10, "2": 20, "3": 30, "4": 40, "5": 50}, "KitCost": 500};
                userObject.insertObject = body;
            } else {
                userObject.insertObject = body;
            }
        }
        new dataBase().insert(userObject, function (err, result) {
            if (!err) {
                var response = {
                    success: true,
                    Message: "User added successfully."
                };
                new responseHandler().sendResponse(req, res, "success", response, 200);
            } else {
                new responseHandler().sendResponse(req, res, "error", "Error while inserting data +" + JSON.stringify(err), 500)
            }
        })
