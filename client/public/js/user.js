var User = User || {};



// ******************************************
// USER
// ******************************************

var base_url = "http://localhost:3000"

$(document).ready(function(){

  // Get the current_user if any Cookie is present (meaning you have never logged out or expired)
  var token = Cookies.get('current_user_authentication_token');
  if (!!token) {
    $.get(base_url + "/users/" + token, function(response){
      User.currentUser = response;
    });
  }

  // On signup send info for Devise (in Rails) to create the user
  $('#signup').on('submit', function(event){
    event.preventDefault();
    var data = {
      registration: {
        email: $('#signup-email').val(),
        password: $('#signup-password').val(),
        password_confirmation: $('#signup-password-confirm').val()
      }
    };
    $.post(base_url + '/users', data, function(response){
      console.log(response);
      // FLASH MESSAGE WELL DONE?
    })
    .fail(function(err) {
      console.log(err);
    })
  });

  // On Login, check OK with Devise and save current_user info in Cookie + User object
  $('#login').on('submit', function(){
    event.preventDefault();
    var data = $('#login').serialize();
    $.post(base_url + "/users/sign_in", data, function(response){
      Cookies.set('current_user_authentication_token', response.authentication_token, { expires: 7 });
      User.currentUser = response;
    })
  });

  // On Logout, tell Devise, delete Cookie, delete current_user
  $('#logout').on('click', function(){
    event.preventDefault();
    // var data = Cookies.get()
    $.ajax({
      type: 'delete',
      url: base_url + "/users/" + User.currentUser.authentication_token
    }).done(function(response){
      User.currentUser = {};
      Cookies.remove('current_user_authentication_token');
    });
  })
  
})
