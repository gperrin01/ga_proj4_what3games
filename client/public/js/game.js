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

  // browse button acts as a reset: back to home page
  $('#main-navbar').on('click', '#play-li', function(){
    console.log('play');
    Game.initialize();
  });
  $("#main-navbar").on('click', '#browse-li', function(){
    console.log('browse');
    User.isLoggedIn();
    Map.initialize();
  })
});

//***********************************
// THE LISTENERS FOR THE GAME AND THE JOURNEY
//***********************************

Listeners = {

  justBrowsing: function(){
    console.log('just browsing ');
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
// THE GAME (and simple challenge)
//***********************************

Game = {

  initialize: function(){
    Game.browsingChallenge();

    // RENDER VIEW WHERE NOTHING IS GREYED and it says ready to play

    // show marker and center map on it + ensure shows info + remvoe any journey shown
    // place marker at Random Loc in central london - muted during devpt so i can play faster and test
    View.centerOnUpdatedMarker(new google.maps.LatLng(51.505831 + Math.random()/100, -0.132134857 - Math.random()/100), Marker.init, Map.zoomInit);
    // View.centerOnUpdatedMarker(Map.latlng, Marker.init, Map.zoomInit);
    Marker.drag(Marker.init);
  },

  browsingChallenge: function() {
    event.preventDefault();
    Listeners.enableMovingOnMap(false)
    Listeners.enableDestination(true);

    // Submitting an answer works differently during Game: check next steps
    google.maps.event.clearInstanceListeners(Marker.infoWindow);

    google.maps.event.addListener(Marker.infoWindow, 'domready', function(){
      $('#submit_answer').on('submit', function(){
        event.preventDefault();
        Game.checkNextStep(Game.goNextStep);
      })
    });
  },

  checkNextStep: function(callbackForInDico){
    event.preventDefault();
    var answer = $('#answer_input').val();
    Answer.isValid(answer, Answer.isInDictionary, callbackForInDico);
  },
  
  goNextStep: function(valid, answer){
    // If TRUE, do all the below, 
    // else the isValid function display the error message and we try again
    if (valid) {

      // UPDATE DATABASE with your answer and score at that location
      var points = Score.calc(answer);
      User.updateDbWithAnswer(answer, points, User.theThreeWords)
      User.currentUser.points += points

      // If good Answer, congrats +1, + allows you to drag pin and find location
      Listeners.enableMovingOnMap(true);

      // Then once a move on the map is made, freeze everything again for the next challenge
      $('#location_forms').off('submit', '#submit_location')
      $('#location_forms').off('click', '#where_am_i')

      $('#location_forms').on('submit', '#submit_location', function(){
        event.preventDefault();
        Map.setToLocation();
        Game.browsingChallenge();
      });
      $('#location_forms').on('click','#where_am_i', function(){
        event.preventDefault();
        Map.setToWhereAmI();
        Game.browsingChallenge();
      });

      Listeners.dragForNextChallenge =  google.maps.event.addListener(Marker.init, 'dragend', Game.browsingChallenge);
    }
  },


// IS THIS USED ANYMORE ???
  stop: function(){
    // back to as if the page was loaded
    Listeners.justBrowsing();
    // show marker and center map on it + remvoe any journey shown
    View.centerOnUpdatedMarker(Map.latlng, Marker.init, Map.zoomInit);
    // DO NOT TRACK SCORE
  }

};  // End Game Object

//***********************************
// THE JOURNEY CHALLENGE
//*****************************

JourneyChallenge = {

  begin: function(){
    event.preventDefault();
    // reset the Journey (count of steps and score)
    JourneyChallenge.countSteps = 1;
    JourneyChallenge.score = 0;

    Listeners.enableMovingOnMap(false);
    Listeners.enableDestination(false);

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

      var msg = {count: count, steps: steps.length-1, score: JourneyChallenge.score};
      View.render($('#main_area_journeychall_template'), msg, $('#main_row_header') );

      // highlight the marker for that step: 3words and special icon
      JourneyChallenge.stepMarker = Marker.stepMarkerArray[count];
      JourneyChallenge.stepMarker.setAnimation(google.maps.Animation.DROP);
      window.setTimeout(function(){
        JourneyChallenge.stepMarker.setAnimation(google.maps.Animation.BOUNCE);
      }, 900);
      Marker.showWords(JourneyChallenge.stepMarker);
      JourneyChallenge.stepMarker.setIcon(Marker.step_icon);
      // recenter the map??
      // Map.map.setCenter(JourneyChallenge.stepMarker.position)

      // Submitting an answer works differently during JourneyChallenge: check next steps
      google.maps.event.clearListeners(Marker.infoWindow, 'domready');

      google.maps.event.addListener(Marker.infoWindow, 'domready', function(){
        $('#submit_answer').on('submit', function(){
          event.preventDefault();
          console.log('submitting journey next steps')
          Game.checkNextStep(JourneyChallenge.moveAlongJourney);
        })
      });
    }

    else {
      // show final score and the bonus calc
      var bonus = Score.calcBonus(steps.length) - 1;
      $('#game_msg').html("Destination reached <span class='glyphicon glyphicon-play'></span>  You earn " 
        + JourneyChallenge.score +  " points and " + bonus + " bonus points"); 
      JourneyChallenge.score += bonus;

      // update the DB with these bonus points then update the user with them
      User.addBonusPoints(bonus);
      User.currentUser += bonus;

      // enable only destination and location fields
      Listeners.enableDestination(true);
      $('#where_am_i').attr('disabled', true);
      $('#geocode_button').attr('disabled', true);
      $('#address_input').attr('disabled', true);    }
  },

  moveAlongJourney: function(valid, answer){
    if (valid) {
      // UPDATE DATABASE with your answer and score at that location
      var points = Score.calc(answer);
      User.updateDbWithAnswer(answer, points, User.theThreeWords)
      User.currentUser.points += points;
      JourneyChallenge.score += points;

      // show the marker as "done"
      JourneyChallenge.stepMarker.setIcon(Marker.succes_icon);
      JourneyChallenge.stepMarker.setAnimation(null);

      // increment the count of sucesfsul steps and play again!
      JourneyChallenge.countSteps++;
      JourneyChallenge.play(JourneyChallenge.myJourney);
    };
  },

  end: function(){

  }


} // End JourneyChallenge Object

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
    return num_steps;
  }
}

















