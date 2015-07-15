var User = User || {};
var View = View || {};

// ******************************************
// Prepare for Signin, Login, Logout
// ******************************************

var base_url = "http://localhost:3000"

$(document).ready(function(){

  User.isLoggedIn();

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

    $.ajax({
      type: 'delete',
      url: base_url + "/users/" + User.currentUser.authentication_token
    }).done(function(response){
      alert('See you soon, ' + User.currentUser.email);
      User.currentUser = {};
      Cookies.remove('current_user_authentication_token');
      document.location.reload();
    });
  });

}); // end doc ready

// ******************************************
// User
// ******************************************


User = {

  isLoggedIn: function(){
    var token = Cookies.get('current_user_authentication_token');
    if (!!token) {
      // Get the current_user if any Cookie is present (meaning you have never logged out or expired)
      $.get(base_url + "/users/" + token, function(response){
        User.currentUser = response;
      });
      // RENDER NAV FOR LOGIN
      View.render( $("#navbar_no_login_template"), null, $('#main-navbar'));
    } else {
      // REDNER NAV FOR WELCOME USER
    }
  },

  updateDbWithAnswer: function(answer, points, threeWords) {
    // In DB, update the points in any case, then check if answer should be persisted in DB
    var data = {
      id: User.currentUser.id,
      word: answer,
      points: points,
      threeWords: threeWords,
      authentication_token: User.currentUser.authentication_token
    };
    $.post(base_url + "/answers", data, function(response){
      console.log('updated points');
      var best_here = response.best_answer;
      var you_here = response.your_answer;
    })
  },

  addBonusPoints: function(points) {
    $.ajax({
      type: 'PUT',
      url: base_url + "/users/" + User.currentUser.authentication_token,
      data: {points: points},
      dataType: 'json'
    }).done(function(response){
      console.log('bonus points');
    })
  }

}  // End User Object

// ******************************************
// Views
// ******************************************

View = {
  render: function(templateElement, object, parentElement) {
    var template = templateElement.html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, object);
    parentElement.append(rendered);
  }
}


