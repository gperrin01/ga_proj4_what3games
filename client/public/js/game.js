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
  Listeners.justBrowsing;
})



//***********************************
// THE LISTENERS FOR THE GAME AND THE JOURNEY
//***********************************


Listeners = {

  justBrowsing: function(){
    Listeners.enableMovingOnMap(true);
    Listeners.enableDestination(true);

    $('#play_button').on('click', Game.initialize);
    $('#game_msg').text("Freely Browse the Map, or Play to Enter the Challenges");

    $('#where_am_i').off('click');
    $('#where_am_i').on('click', Map.setToWhereAmI)

    $('#submit_location').off('submit');
    $('#submit_location').on('submit', Map.setToLocation);

    $('#submit_destination').on('submit', JourneyChallenge.begin);

    $('#submit_answer').off('submit');
    $('#submit_answer').on('submit', Answer.submit);
  },

  gameStarted: function(){
    Listeners.enableMovingOnMap(false)
    // finally let the stop button end the game
    $('#stop_button').on('click', Game.stop);
  }, 

  // prevent clicks on the map or finding a new location
  enableMovingOnMap: function(boolean) {
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
  }

} // End Listeners Object


//***********************************
// THE GAME (and simple challenge)
//***********************************

Game = {

  initialize: function(){
    Game.browsingChallenge();
    // show marker and center map on it + ensure shows info + remvoe any journey shown
    // place marker at Random Loc in central london - muted during devpt so i can play faster and test
    // Display.centerOnUpdatedMarker(new google.maps.LatLng(51.505831 + Math.random()/100, -0.132134857 - Math.random()/100), Marker.init, Map.zoomInit);
    Display.centerOnUpdatedMarker(Map.latlng, Marker.init, Map.zoomInit);
    Marker.drag(Marker.init);
  },

  browsingChallenge: function() {
    event.preventDefault();
    Listeners.gameStarted();
    //Welcome message
    $('#rules_display').text("Browsing Challenge! Get your answer to be able to browse the map again!");

    // Submitting an answer works differently during Game: check ntext steps
    $('#submit_answer').off('submit');
    $('#submit_answer').on('submit', function(){
      Game.checkNextStep(Game.goNextStep);
    });

    // COUNT SCORE!!!!! WILL HAVE TO BE HOOKED WITH THE DB !!!
  },

  checkNextStep: function(callbackForInDico){
    event.preventDefault();
    var answer = $('#answer_input').val();
    Answer.isValid(answer, Answer.isInDictionary, callbackForInDico);
  },

  goNextStep: function(valid, word){
    // If TRUE, do all the below, 
    // else the isValid function display the error message and we try again
    if (valid) {
      // Update your score and store in DB
      var points = Score.calc(word);
      console.log(points);
      // HOOK With Current_user object so that the views are refreshed whenever opened??

      // if good Answer, congrats +1, + allows you to drag pin and find location
      Listeners.enableMovingOnMap(true);

      // Then once a move on the map is made, freeze everything again for the next challenge
      $('#submit_location, #where_am_i').off('submit');
      $('#submit_location').on('submit', function(){
        event.preventDefault();
        Map.setToLocation();
        Game.browsingChallenge();
      });
      $('#where_am_i').on('click', function(){
        event.preventDefault();
        Map.setToWhereAmI();
        Game.browsingChallenge();
      });
      Listeners.dragForNextChallenge =  google.maps.event.addListener(Marker.init, 'dragend', Game.browsingChallenge);
    }
  },

  stop: function(){
    // back to as if the page was loaded
    Listeners.justBrowsing();
    // show marker and center map on it + remvoe any journey shown
    Display.centerOnUpdatedMarker(Map.latlng, Marker.init, Map.zoomInit);
    // DO NOT TRACK SCORE
    // end stop button is muted
    $('#stop_button').off('click', Game.stop);   
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
    $('#game_msg').text("Journey Challenge! Quizz your way until destination!");

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
    if (count < steps.length){

      $('#game_msg').html('Checkpoint ' + count + '/' + (steps.length-1)
        + ' <span class="glyphicon glyphicon-play"></span>  Score: '+ JourneyChallenge.score );

      // highlight the marker for that step: 3words and special icon
      JourneyChallenge.stepMarker = Marker.stepMarkerArray[count];
      Marker.showWords(JourneyChallenge.stepMarker);
      JourneyChallenge.stepMarker.setIcon(Marker.step_icon);
      // recenter the map??
      Map.map.setCenter(JourneyChallenge.stepMarker.position)

      // Submitting an answer works differently during JourneyChallenge: check next steps
      $('#submit_answer').off('submit');
      $('#submit_answer').on('submit', function(){
        Game.checkNextStep(JourneyChallenge.moveAlongJourney)
      });
    }
    else {
      // show final score and the bonus calc
      var bonus = Score.calcBonus(steps.length) - 1;
      $('#game_msg').html("Nice job!  <span class='glyphicon glyphicon-play'></span>  You earn " 
        + JourneyChallenge.score +  " points and " + bonus + " bonus points"); 
      JourneyChallenge.score += bonus;
    }
  },

  moveAlongJourney: function(valid, word){
    if (valid) {

      // Update your score in DB - Store in current_user? SAME AS FOR BROWSING
      // Add to cumul for current journey
      JourneyChallenge.score += Score.calc(word);

      // show the marker as "done"
      JourneyChallenge.stepMarker.setIcon(Marker.succes_icon);
      // increment the count of sucesfsul steps and play again!
      JourneyChallenge.countSteps++;
      JourneyChallenge.play(JourneyChallenge.myJourney);
    };
  }


} // End JourneyChallenge Object

//***********************************
// THE SCORE
//***********************************

Score = {

  calc: function(word) {
    var length = word.length;
    if (length >= 10) return 2 * (length + 2); // above 10 letters you get maxi bonus
    else if (length === 9) return 16; // bonus is higher when large word
    else if (length === 8) return 11;
    else if (length === 7) return 7;
    else if (length === 6) return 4;
    else if (length === 5) return 2;
    else if (length === 4) return 1;// 4-5 letters are only decent, no bonus
    else  return 0; // 3 is easy, no reward but allowing you to keep playing
  },
  calcBonus: function(num_steps){
    return num_steps;
  }
}

















