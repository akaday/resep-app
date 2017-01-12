$(document).ready(function() {

// check_login();
$("#alert").attr('class', '');
$("#alert").hide();


/** BUTTON **/
/** do login **/
$(document).on('click','#do_login',function(){

  $("#alert").attr('class', '');
  $("#alert").hide();

  var email         = $("#email").val();
  var password      = $("#password").val();

  if(email.length == 0){
    $("#alert_email").html("email can't be empty");
    $("#email").focus();

    $("#alert").addClass('alert alert-danger');
    $("#alert").html("<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> username can't be empty");
    $("#alert").show();
  }
  else if(password.length == 0){
    $("#alert_password").html("password can't be empty");
    $("#password").focus();

    $("#alert").addClass('alert alert-danger');
    $("#alert").html("<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> password can't be empty");
    $("#alert").show();
  }
  else{

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      if(error.code == "auth/user-not-found")
      {
        $("#alert").addClass('alert alert-danger');
        $("#alert").html("<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> username's not found");
        $("#alert").show();
      }
      else if(error.code == "auth/wrong-password"){
        $("#alert").addClass('alert alert-danger');
        $("#alert").html("<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> wrong username or password");
        $("#alert").show();
      }
      console.log(error.code);
      console.log(error.message);
    });
  }

});

/** do logout **/
$(document).on('click','#do_logout',function(){

  firebase.auth().signOut().then(function() {
     console.log("Logged out!");
     $.removeCookie('user_session');  //remove cookies
  }, function(error) {
     console.log(error.code);
     console.log(error.message);
  });

});
/** END BUTTON **/


/** CHECK LOGIN, SHOW AND HIDE ALERT **/
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // alert(user.email);
        $("#alert").addClass('alert alert-success');
        $("#alert").html("<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> LOGIN ");
        $("#alert").show();
        $("#do_logout").show();

        //goto another page
        window.location.href = 'dashboard.html';
    }
    else{
        $("#alert").show();
        $("#do_logout").hide();
    }
});

});
