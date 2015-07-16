var User = User || {};
var View = View || {};

// ******************************************
// Prepare for Signin, Login, Logout
// ******************************************

var base_url = "http://localhost:3000"

$(document).ready(function(){

  User.isLoggedIn();
  User.signupProcess();
  User.loginProcess();
  User.logoutProcess();

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
        // RENDER NAV FOR LOGIN
        User.currentUser.splitEmail = User.currentUser.email.split('@')[0];
        View.render( $("#navbar_isloggedin_template"), User.currentUser, $('#main-navbar'), 'slideDown' );
      });
    } else {
      // REDNER NAV FOR WELCOME USER
      View.render( $("#navbar_no_login_template"), null, $('#main-navbar') );
    }
  },

  loginProcess: function(){
    // Signup form visible only on click on the sign up button
    $('.login_link').on('click', function(){
      console.log('click login');
      var header = $('#main_row_header');
      View.render( $('#login_form_template'), null, header, 'slideDown' );
      // form.fadeIn("slow"); ANIMATIONS !!!

    });

    // On Login, check OK with Devise and save current_user info in Cookie + User object
    $('body').on('submit', '#login', function(){
      event.preventDefault();
      console.log('submit login');
      var data = $('#login').serialize();
      $.post(base_url + "/users/sign_in", data, function(response){
        Cookies.set('current_user_authentication_token', response.authentication_token, { expires: 7 });
        User.currentUser = response;
        // reload the page and have it all ready for the user
        document.location.reload();
        // RENDER NAV FOR LOGIN
        // console.log('render login');
        // User.currentUser.splitEmail = User.currentUser.email.split('@')[0];
        // View.render( $("#navbar_isloggedin_template"), User.currentUser, $('#main-navbar') );
      })
    });
  },

  signupProcess: function() {
    // Signup form visible only on click on the sign up button
    $('.signup_link').on('click', function(){
      var form = $('#signup_form_template')
      View.render( form, null, $('#main_row_header'),'slideDown' );
      // form.fadeIn("slow"); ANIMATIONS !!!
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
      $.post(base_url + '/users', data, function(response){
        console.log(response);
        // FLASH MESSAGE WELL DONE?
      })
      .fail(function(err) {
        console.log(err);
      })
    });
  },

  logoutProcess: function(){
    // On Logout, tell Devise, delete Cookie, delete current_user
    $('#main-navbar').on('click', '#logout', function(){
      event.preventDefault();
      console.log('click');
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
  // render = fully change parent element, 
  // append = add to parent element
  render: function(templateElement, object, parentElement, animation) {
    // parentElement.empty();
    var template = templateElement.html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, object);
    parentElement.html(rendered);

    if (animation === 'slideDown'){
      parentElement.hide();
      parentElement.slideDown('slow');
    }
  }
}


