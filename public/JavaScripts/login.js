/**
 * Created by sakshamgrover on 20/04/15.
 */




$('#loginButton').click(function() {

        var x=document.getElementById("inputEmail");
        if (x.value==null || x.value=="") {
            alert("Username must be filled out");
            x.focus();
        }
                else
                {
                    var y=document.getElementById("inputPassword");

                    if (y.value==null || y.value=="")
                    {
                        alert("Password must be filled out");
                        y.focus();}

                else {
                parent.location='FranchiseMain.html';
            }

                }
            }




)