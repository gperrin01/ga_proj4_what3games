var User = User || {};
var View = View || {};

// ******************************************
// Prepare for Signin, Login, Logout
// ******************************************

var base_url = "http://localhost:3000";

$(document).ready(function(){
  User.isLoggedIn();
  User.signupProcess();
  User.loginProcess();
  User.logoutProcess();
  $('#main_row_header').on('click', '#ranking', User.rankings);
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
        View.render( $("#navbar_isloggedin_template"), User.currentUser, $('#main-navbar'), 'slideDown' );
        View.render( $("#main_area_loggedin_template"), User.currentUser, $('#main_row_header'), 'slideDown' );
        View.render( $("#location_forms_loggedin_template"), User.currentUser, $('#location_forms'), 'slideDown' );
      });
    } else {
      // REDNER NAV and Main area for NO LOGGED user
      View.render( $("#navbar_no_login_template"), null, $('#main-navbar') );
      View.render( $("#main_area_not_loggedin_template"), null, $('#main_row_header'), 'slideDown' )
      View.render( $("#location_forms_not_loggedin_template"), null, $('#location_forms'), 'slideDown' )
    }
  },

  loginProcess: function(){
    // Signup form visible only on click on the sign up button
    $('.login_link').on('click', function(){
      console.log('click login');
      View.render( $('#login_form_template'), null, $('#main_row_header'), 'slideDown' );
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
  },

  rankings: function() {
    event.preventDefault();

    console.log('prepare rankings');
    // send the current_user auth token and receive his rankings as well as the global rankings
    // top 5 w most points + top 5 with best ever answer + top 5 best at this lcoation
// data will show "  one two three"
    var data = {words: $('#three_words').text().split(' ').slice(2,5).join(' ')};
    $.ajax({
      url: base_url + "/users/" + User.currentUser.authentication_token + "/ranking",
      data: data,
      dataType: 'json' 
    }).done(function(response){
      console.log('rankings', response);

      var userRanks = {
        totalPoints: User.currentUser.points,
        ranking: response.user_rank,
        rank_here: response.user_rank_here,
        nick: User.currentUser.splitEmail,
        nUsers: response.n_users,
        myBest: response.my_best
      };
        // top3 scores
        userRanks.topScores1mail = response.top3_score.length > 0 ? response.top3_score[0][0] : 'n/a';
        userRanks.topScores1points = response.top3_score.length > 0 ? response.top3_score[0][1] : 'n/a';
        userRanks.topScores2mail = response.top3_score.length > 1 ? response.top3_score[1][0] : 'n/a';
        userRanks.topScores2points = response.top3_score.length > 1 ? response.top3_score[1][1] : 'n/a';
        userRanks.topScores3mail = response.top3_score.length > 2 ? response.top3_score[2][0] : 'n/a';
        userRanks.topScores3points = response.top3_score.length > 2 ? response.top3_score[2][1] : 'n/a';
        // top3 answers
        userRanks.topAnswers1mail = response.top3_answers.length > 0 ? response.top3_answers[0][0] : 'n/a';
        userRanks.topAnswers1points = response.top3_answers.length > 0 ? response.top3_answers[0][1] : 'n/a';
        userRanks.topAnswers2mail = response.top3_answers.length > 1 ? response.top3_answers[1][0] : 'n/a';
        userRanks.topAnswers2points = response.top3_answers.length > 1 ? response.top3_answers[1][1] : 'n/a';
        userRanks.topAnswers3mail = response.top3_answers.length > 2 ? response.top3_answers[2][0] : 'n/a';
        userRanks.topAnswers3points = response.top3_answers.length > 2 ? response.top3_answers[2][1] : 'n/a';
        // top3 answers here
        userRanks.topHere1mail = response.top3_here.length > 0 ? response.top3_here[0][0] : 'n/a';
        userRanks.topHere1points = response.top3_here.length > 0 ? response.top3_here[0][1] : 'n/a';
        userRanks.topHere2mail = response.top3_here.length > 1 ? response.top3_here[1][0] : 'n/a';
        userRanks.topHere2points = response.top3_here.length > 1 ? response.top3_here[1][1] : 'n/a';
        userRanks.topHere3mail = response.top3_here.length > 2 ? response.top3_here[2][0] : 'n/a';
        userRanks.topHere3points = response.top3_here.length > 2 ? response.top3_here[2][1] : 'n/a'

        // View.renderRankings(response);

      View.render( $('#rankings_template'), userRanks, $('#rankings_zone'))
      // $('#rankings_zone').fadeIn('slow', function(){
      //   console.log('fadein');
      });
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
  },

  append:  function(templateElement, object, parentElement, animation) {
    // parentElement.empty();
    var template = templateElement.html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, object);
    parentElement.append(rendered);
  },

  renderRankings: function(userResponse) {
  //   // Iterate through response and append to the table bodies

  //   for (var i=0; i <= 2 && i < userResponse.top5_score.length; i++){
  //     $('#top_answers').empty();
  //     View.render( $('#top_answers'), userResponse.top5_score[i], $('#rankings_table_template') )
  //   }
  // }
  }
}


