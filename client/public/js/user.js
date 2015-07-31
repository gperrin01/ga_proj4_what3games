var User = User || {};

// ******************************************
// Prepare for Signin, Login, Logout
// ******************************************

// Link to the Server as deployed on Heroku
var base_url = "https://obscure-temple-5257.herokuapp.com/";

$(document).ready(function(){
  User.isLoggedIn();
  User.signupProcess();
  User.loginProcess();
  User.logoutProcess();
}); 

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
        // RENDER NAV and Main area FOR LOGIN
        User.currentUser.splitEmail = User.currentUser.email.split('@')[0];
        View.render( $("#navbar_isloggedin_template"), User.currentUser, $('#main-navbar') );
        View.render( $("#main_area_loggedin_template"), User.currentUser, $('#main_row_header'), 'slideDown' );
        View.render( $("#location_forms_loggedin_template"), User.currentUser, $('#location_forms') );
      });
    } else {
      // REDNER NAV and Main area for NO LOGGED user
      View.render( $("#navbar_no_login_template"), null, $('#main-navbar') );
      View.render( $("#main_area_not_loggedin_template"), null, $('#main_row_header'), 'slideDown' )
      View.render( $("#location_forms_not_loggedin_template"), null, $('#location_forms') )
    }
  },

  loginProcess: function(){
    // Signup form visible only on click on the sign up button
    $('.login_link').on('click', function(){
      View.render( $('#login_form_template'), null, $('#main_row_header'), 'slideDown' );
    });

    // On Login, check OK with Devise and save current_user info in Cookie + User object
    $('body').on('submit', '#login', function(){
      event.preventDefault();
      var data = $('#login').serialize();
      console.log('submit login with', data);

      $.post(base_url + "/users/sign_in", data, function(response){
        Cookies.set('current_user_authentication_token', response.authentication_token, { expires: 7 });
        User.currentUser = response;
        // reload the page and have it all ready for the user
        document.location.reload();
      })
      .fail(function(err){
        console.log('error for login', err);
        alert('An error occured during Login.\n', err)
      })
    });
  },

  signupProcess: function() {
    // Signup form visible only on click on the sign up button
    $('.signup_link').on('click', function(){
      var form = $('#signup_form_template')
      View.render( form, null, $('#main_row_header'),'slideDown' );
    });

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
      console.log('signing up with', data);

      $.post(base_url + '/users', data, function(response){
        console.log('you signed up', response);
        alert('Thank you for signing up.\nYou can now log in');
        // FLASH MESSAGE WELL DONE?
      })
      .fail(function(err) {
        console.log('error for signup', err);
        alert('An error occured during signup.\n', err)
      })
    });
  },

  logoutProcess: function(){
    // On Logout, tell Devise, delete Cookie, delete current_user
    $('#main-navbar').on('click', '#logout', function(){
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

      // finally update the badge near the ranking
      User.currentUser.points += points
      $('#ranking .badge').text(User.currentUser.points)
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

      // finally update the badge near the ranking
      User.currentUser.points += points;
      $('#ranking .badge').text(User.currentUser.points);
    })
  }

}  // End User Object



