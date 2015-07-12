//***********************************
// SPECS
//***********************************

// Ok to try answers without clicking play, but it should not capture your score!!!

// When Click play, the game starts
  // scores will be kept

  // Simple game: move pin around or choose a location
    // cannot move pin or click a location unless you win or press stop - will show msg
    // if click destination if will ask are you sure you quit the free-walk game

    // Journey challenge: starts when you create a journey
    // if you try to move the pin or select a location 
      // it will ask: are you sure you want to quit the journey challenge 

// When click stop, all listeners back to normal





var Game = Game || {};
var JourneyChallenge = JourneyChallenge || {};
var Listeners = Listeners || {};

var $game_msg = $('#game_msg');
var $rules_display = $('#rules_display');

$(document).ready(function(){
  $('#play_button').on('click', Game.initialize);
  $('#submit_answer').on('submit', Answer.submit);
})


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
    // THIS REALLY LOOKS LIKE I SHOULD BE USING TEMPLATING!! (but only backbone gives the listeners)

    //Welcome message
    $('#rules_display').text("Browsing Challenge! Get your answer to be able to browse the map again!");
    // mute marker drag, mute whereAmI, mute find location, mute showJourney
    Listeners.gameStarted();
    // turn on .journeyChallenge and off the potential listeners from the journey game
    $('#submit_destination').off('submit');
    $('#submit_destination').on('submit', JourneyChallenge.initialize);

    // Submitting an answer works differently during Game: check ntext steps
    $('#submit_answer').off('submit', Answer.submit);
    $('#submit_answer').on('submit', Game.browsingNextStep);

    // COUNT SCORE!!!!! WILL HAVE TO BE HOOKED WITH THE DB !!!
    
    // finally let the stop button end the game
    $('#stop_button').on('click', Game.stop);

  },

  browsingNextStep: function(){
    event.preventDefault();
    
    var answer = $('#answer_input').val();
    Answer.isValid(answer, Answer.isInDictionary, goNextStep);

    function goNextStep(valid){
      if (valid) {
        console.log('next step of the browsing');

        $('#game_msg').text("Move on the map to go the next challenge!");

        // if good Answer, congrats +1, + allows you to drag pin and find location
        Marker.init.setOptions({draggable: true});
        $('#submit_location').show();
        $('#where_am_i').show();

        // then once dragged or shown, mute again -> Game.browsingChallenge() ??
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
      // else the isValid function SHOULD display the right message and we try again
    }
  },

  stop: function(){
    // back to as if the page was loaded
    Listeners.justBrowsing();
    // show marker and center map on it + remvoe any journey shown
    Display.centerOnUpdatedMarker(Map.latlng, Marker.init, Map.zoomInit);

    // freely move the marker without triggering the game
    google.maps.event.removeListener(Listeners.dragForNextChallenge);

    // Submitting an answer: back to normal browsing outside of game
    $('#submit_answer').off('submit', Game.browsingNextStep);
    $('#submit_answer').on('submit', Answer.submit);

    // scores are not tracked

    // end stop button is muted
    $('#stop_button').off('click', Game.stop);    
  }

};  // End Game Object

//***********************************
// THE JOURNEY CHALLENGE
//*****************************

JourneyChallenge = {

  initialize: function(){

    event.preventDefault();

    // update buttons to enable to submit a location and destination
    $('#game_msg').text("Journey Challenge! Enter an origin and a destination!");
    $('#destination_button').val('Enter Destination')
    $('#submit_location').show();
    $('#submit_location').off('submit');
    $('#submit_destination').off('submit');
    $('#submit_destination').on('submit', JourneyChallenge.begin)
    
    // Nothing can be submitted at this points
    $('#words_zone').hide();


    // navigate through the steps
  },

  begin: function(){
    event.preventDefault();

    $('#game_msg').text("Journey Challenge! Get your answer right to move one step closer to the final destination!");
    $('#words_zone').show();

    $('#submit_location').hide();
    $('#submit_destination').hide();

    //  Variation around the Journey.show, same vein as for the browsingNextSteps
    Journey.show('foo', JourneyChallenge.play);
  },

  play: function(route) {
    console.log('play journey', route);
    $('#journey_recap').show();

    var steps = route[0].steps;
    $('#journey_recap').text('Step one of ' + steps.length + ' || Points: ' );

    console.log(Marker.stepMarkerArray);
    Display.threeWords(Marker.stepMarkerArray[3]);
    // Marker.markerInfo.setContent('teeeeest');
    // Marker.markerInfo.open(Map.map, Marker.stepMarkerArray[4]);
  }

}


//***********************************
// THE LISTENERS FOR THE GAME AND THE JOURNEY
//***********************************


Listeners = {

  justBrowsing: function(){
    $('#where_am_i').off('click');
    $('#where_am_i').on('click', Map.setToWhereAmI)
    $('#submit_location').off('submit');
    $('#submit_location').on('submit', Map.setToLocation);

    // Desination normal behaviour without triggering  journeyChallenge
    $('#submit_destination').off('submit', JourneyChallenge.initialize);
    $('#destination_button').off('click', JourneyChallenge.initialize);
    $('#submit_destination').on('submit', Journey.show);

    // Update the buttons to reflect we are just browsing through the map
    $('#where_am_i').show();
    $('#submit_location').show();
    $('#destination_button').val('Enter Destination')
    $('#play_button').text('Start Playing!');
    $('#game_msg').text("Click Above to Start Playing and Count Your Score!");

    // markers CAN be cliked on and dragged
    if (Marker.init) {Marker.init.setOptions({draggable: true});}
  },

  gameStarted: function(){
    console.log('game started');
    // $('#where_am_i').off('click', Map.setToWhereAmI)
    // $('#submit_location').off('submit', Map.setToLocation);
    // hiding seems the best, let's see if it screws up the styling
    $('#where_am_i').hide();
    $('#submit_location').hide();
    $('#submit_destination').off('submit', Journey.show);

    // Update the buttons to reflect we are Playing
    $('#play_button').text('Start again');
    $('#destination_button').val('Start Journey Challenge!');
    $('#game_msg').text("Easy Walk Challenge! Get your answer right to be able to browse the map again!");

    // markers cannot be dragged 
    if (Marker.init) {Marker.init.setOptions({draggable: false});}
  }

} // End Listeners Object















