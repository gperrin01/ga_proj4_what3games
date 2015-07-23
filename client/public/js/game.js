//***********************************
// SPECS
//***********************************

// Ok to try answers without clicking play, but it should not capture your score!!!

// When Click play, the game starts
  // scores will be kept

  // Simple game: move pin around or choose a location
    // cannot move pin or click a location unless you win or press stop - will show msg
    // if click destination if will ask are you sure you quit the free-walk game
// When click Journey: starts when you create a journey
    // if you try to move the pin or select a location 
      // it will ask: are you sure you want to quit the journey challenge 

// When click stop, all listeners back to normal

// SCORES
// when click 'play', score is reset to zero
// play free-flow and journey to add to your score
// Both: Points added to DB for each move (with record of the 3 words)
// Journey: bonus for finishing journey, as a function of #steps (because more commitment than free-flow)



var Game = Game || {};
var JourneyChallenge = JourneyChallenge || {};
var Score = Score || {};
var Listeners = Listeners || {};

$(document).ready(function(){
  Listeners.justBrowsing();

  // Home button acts as a reset: back to home page
  $("#main-navbar").on('click', '#home-li', function(){
    console.log('browse');
    User.isLoggedIn();
    Map.initialize();
  })

  $("#main-navbar").on('click', '#explore-li', Game.beginExploration);

  // // not sure i will keep this 'freeze and play' game
  // $('#main-navbar').on('click', '#play-li', function(){
  //   console.log('play');
  //   Game.initialize();
  // });
});


//***********************************
// THE GAME (and simple challenge)
//***********************************


Game = {

  beginExploration: function() {
    console.log('begin beginExploratio');

    // prepare the map and all listeners, according to Game.mode
    Game.mode = 'explore';
    Map.initialize();

    // show main message for exploration, prevent clicking on destination
    View.render( $('#main_area_explore_template'), User.currentUser, $('#main_row_header'), 'slideDown' );
    View.render( $('#location_forms_explore_template'), User.currentUser, $('#location_forms') );

    // reset the array storing the right answers
    Game.countAnswers = [];

    //  specify Action to avoid duplication of event listeners on the submit
    // Marker.showWords(Marker.init, 'explore');

    // google.maps.event.clearListeners(Marker.infoWindow, 'domready');
    // google.maps.event.addListener(Marker.infoWindow, 'domready', function(){
    //   $('#submit_answer').on('submit', function(){
    //     event.preventDefault();
    //     console.log('submit explore');
    //     Answer.submit(Game.exploreNext);
    //   })
    // });
  },

  exploreNext: function(valid, answer){
    // If TRUE, do all the below, 
    // else the isValid function displays the error message and we try again
    if (valid) {
      console.log('explore next', valid);

      // store the word in the array and display on the page
      Game.countAnswers.push(answer);
      var num = {0: 'first', 1: 'second', 2: 'third'}[Game.countAnswers.length - 1];
      var next = {0: 'first', 1: 'second', 2: 'third'}[Game.countAnswers.length];
      $('#'+num+'_answer').text(answer);

      // Update scores in Explore? 
      var points = Score.calc(answer);
      User.updateDbWithAnswer(answer, points, User.theThreeWords)    

      if (Game.countAnswers.length < 3) {
        // msg for you to keep playing
        $('#submit_answer').html("<input type='button' class='btn btn-info' value='Move the marker to your " +next+ " location!'>");
      } 
      else {
        // once you got 3 words, animation? show a button saying click to find out your next destination
        var words = Game.countAnswers.join(' ');
        var words_for_w3w = Game.countAnswers.join('.');
        var html = "<input type='button' class='btn btn-info'"
                + "value='Three right answers! Click here to be transported to &#34;" +words+ "&#34;'>"
        $('#submit_answer').html(html);

        // reset the array so that on next location you start again
        Game.countAnswers = [];

        // click on the body to be transported!
        $('#the_answer').one('click', function(){
          event.preventDefault();
          Game.teleportTo(words_for_w3w);
        });
      }
    } 
    else { // If not valid
      console.log('not valid')
    } 
  }, // end exploreNext

  teleportTo: function(words) {
    console.log('teleport to', words);

    // get W3W to transform the 3 words into coordinates
    var data = {'key': Keys.w3w_api, 'string': words};
    $.post('http://api.what3words.com/w3w', data, function(response) {
      console.log(response);
      View.render( $('#main_area_explore_template'), User.currentUser, $('#main_row_header') );

      // check if the word is recognized or if there is an error
      if (response.error === '11'){
        var html = "<input type='button' class='btn btn-info'"
                + "value='There is no location with that combination. Move on the map to play again'>";
        $('#submit_answer').html(html);
      }
      else if (!!response.error){
        var html = "<input type='button' class='btn btn-info' value='Click here to play again (Error: " +response.message+ ")'>";
        $('#submit_answer').html(html);
      } 
      else { // if no error, teleport me
      var ggl_coords = {A: response.position[0], F: response.position[1]};
      console.log('ggl_coords', ggl_coords);
      View.centerOnUpdatedMarker(ggl_coords, Marker.init, Map.zoomShowLocation);
      }
    });
  }


// // not sure i will keep this 'freeze and play' game

//   initialize: function(){
//     Game.browsingChallenge();

//     // RENDER VIEW WHERE NOTHING IS GREYED and it says ready to play

//     // show marker and center map on it + ensure shows info + remvoe any journey shown
//     // place marker at Random Loc in central london - muted during devpt so i can play faster and test
//     View.centerOnUpdatedMarker(new google.maps.LatLng(51.505831 + Math.random()/100, -0.132134857 - Math.random()/100), Marker.init, Map.zoomInit);
//     // View.centerOnUpdatedMarker(Map.latlng, Marker.init, Map.zoomInit);
//     Marker.drag(Marker.init);
//   },

//   browsingChallenge: function() {
//     event.preventDefault();
//     Listeners.enableMovingOnMap(false)
//     Listeners.enableDestination(true);

//     // Submitting an answer works differently during Game: check next steps
//     google.maps.event.clearInstanceListeners(Marker.infoWindow);

//     google.maps.event.addListener(Marker.infoWindow, 'domready', function(){
//       $('#submit_answer').on('submit', function(){
//         event.preventDefault();
//         Answer.submit(Game.goNextStep);
//       })
//     });
//   },
  
//   goNextStep: function(valid, answer){
//     // If TRUE, do all the below, 
//     // else the isValid function displays the error message and we try again
//     if (valid) {

//       // UPDATE DATABASE with your answer and score at that location
//       var points = Score.calc(answer);
//       User.updateDbWithAnswer(answer, points, User.theThreeWords)

//       // If good Answer, congrats +1, + allows you to drag pin and find location
//       Listeners.enableMovingOnMap(true);

//       // Then once a move on the map is made, freeze everything again for the next challenge
//       $('#location_forms').off('submit', '#submit_location')
//       $('#location_forms').off('click', '#where_am_i')

//       $('#location_forms').on('submit', '#submit_location', function(){
//         event.preventDefault();
//         Map.setToLocation();
//         Game.browsingChallenge();
//       });
//       $('#location_forms').on('click','#where_am_i', function(){
//         event.preventDefault();
//         Map.setToWhereAmI();
//         Game.browsingChallenge();
//       });

//       Listeners.dragForNextChallenge =  google.maps.event.addListener(Marker.init, 'dragend', Game.browsingChallenge);
//     }
//   }

};  // End Game Object

//***********************************
// THE JOURNEY CHALLENGE
//*****************************

JourneyChallenge = {

  begin: function(){
    event.preventDefault();
    Game.mode = 'journey';
    // reset the Journey (count of steps and score)
    JourneyChallenge.countSteps = 1;
    JourneyChallenge.score = 0;

    Listeners.enableMovingOnMap(false);

    //  Variation around the Journey.show, same vein as for the browsingNextSteps
    Journey.show(null, JourneyChallenge.play);
  },

  play: function(route) {
    // store the route for later use
    JourneyChallenge.myJourney = route;
    var count = JourneyChallenge.countSteps;
    var steps = route[0].steps;
    console.log('steps', steps);

    // Until you reach the final step (end of steps array):
    if (count < steps.length) {

      // Tells you where you are: checkpoint stage and points accumulated
      var msg = {count: count, steps: steps.length-1, score: JourneyChallenge.score, points: User.currentUser.points};
      View.render($('#main_area_journeychall_template'), msg, $('#main_row_header'), 'slideDown' );
      View.render($('#location_forms_journeychallenge_template'), msg, $('#location_forms') );

      // highlight the marker for that step: 3words and special icon
      JourneyChallenge.stepMarker = Marker.stepMarkerArray[count];
      JourneyChallenge.stepMarker.setAnimation(google.maps.Animation.DROP);
      window.setTimeout(function(){
        JourneyChallenge.stepMarker.setAnimation(google.maps.Animation.BOUNCE);
      }, 900);
      JourneyChallenge.stepMarker.setIcon(Marker.step_icon);

      // pass gameType 'journey' to ensure having the right Listeners on the Gmap things
      // in this case we dont want showWords to add a listener as we do it ourselves below
      Marker.showWords(JourneyChallenge.stepMarker, 'journey');

      // recenter the map??
      // Map.map.setCenter(JourneyChallenge.stepMarker.position)

      // Submitting an answer works differently during JourneyChallenge: check next steps
      google.maps.event.clearListeners(Marker.infoWindow, 'domready');

      google.maps.event.addListener(Marker.infoWindow, 'domready', function(){
        $('#submit_answer').on('submit', function(){
          event.preventDefault();
          console.log('submitting journey next steps')
          Answer.submit(JourneyChallenge.moveAlongJourney);
        })
      });
    }

    else {
      // show final score and the bonus calc 
      var bonus = Score.calcBonus(steps.length);
      $('#game_msg').html("Destination reached <span class='glyphicon glyphicon-star'></span>  You earn " 
        + JourneyChallenge.score +  " points and " + bonus + " bonus points"); 
      $('#down').empty();

      // update the DB with these bonus points then update the user with them
      User.addBonusPoints(bonus);

      // enable only destination and location fields
      Listeners.enableDestination(true);
      $('#where_am_i').attr('disabled', false);
      $('#geocode_button').attr('disabled', false);
      $('#address_input').attr('disabled', false);    
    }
  },

  moveAlongJourney: function(valid, answer){
    if (valid) {
      // UPDATE DATABASE with your answer and score at that location
      var points = Score.calc(answer);
      User.updateDbWithAnswer(answer, points, User.theThreeWords);

      JourneyChallenge.score += points;

      // show the marker as "done"
      JourneyChallenge.stepMarker.setIcon(Marker.succes_icon);
      JourneyChallenge.stepMarker.setAnimation(null);

      // Change layout to say click anywhere to continue
      $('#submit_answer').html("<input type='button' class='btn btn-info' value='Click Anywhere to Continue'>")

      // increment the count of sucesfsul steps and play again once clicked anywhere on the body
      JourneyChallenge.countSteps++;
      $('body').one('click', function(){
         JourneyChallenge.play(JourneyChallenge.myJourney);
      })

    };
  }


} // End JourneyChallenge Object


//***********************************
// THE LISTENERS FOR THE GAME AND THE JOURNEY
//***********************************

Listeners = {

  justBrowsing: function(){
    console.log('just browsing ');
    Game.mode = 'browse';
    // Turn on the relevant events and cancel the previous ones -  EVENT DELEGATION
    Listeners.enableMovingOnMap(true);
    Listeners.enableDestination(true);
    $('#location_forms').off('submit');
    $('#location_forms').off('click');

    $('#location_forms').on('click', '#where_am_i', Map.setToWhereAmI)
    $('#location_forms').on('submit', '#submit_location', Map.setToLocation);
    $('#location_forms').on('submit', '#submit_destination', JourneyChallenge.begin);
  },

  // prevent clicks on the map or finding a new location
  enableMovingOnMap: function(boolean) {
    console.log('move on map', boolean);
    $('#where_am_i').attr('disabled', !boolean);
    $('#geocode_button').attr('disabled', !boolean);
    $('#address_input').attr('disabled', !boolean);

    // If TRUE, markers CAN be dragged & will not trigger the game
    if (Marker.init) {Marker.init.setOptions({draggable: boolean});};
    google.maps.event.removeListener(Listeners.dragForNextChallenge);

    boolean ? $('#game_msg').text("Move on the map for the next challenge!") 
        : $('#game_msg').text("Get your answer right to browse the map again");
  },

  enableDestination: function(boolean) {
    $('#destination_input').attr('disabled', !boolean);
    $('#destination_button').attr('disabled', !boolean);
  },


} // End Listeners Object


//***********************************
// THE SCORE
//***********************************

Score = {

  calc: function(word) {
    return word.length;
    // var length = word.length;
    // if (length >= 10) return 2 * (length + 2); // above 10 letters you get maxi bonus
    // else if (length === 9) return 16; // bonus is higher when large word
    // else if (length === 8) return 11;
    // else if (length === 7) return 7;
    // else if (length === 6) return 4;
    // else if (length === 5) return 2;
    // else if (length === 4) return 1;// 4-5 letters are only decent, no bonus
    // else  return 0; // 3 is easy, no reward but allowing you to keep playing
  },
  calcBonus: function(num_steps){
    return num_steps - 1;
  }
}

















