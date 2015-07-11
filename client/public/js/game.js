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
var Listeners = Listeners || {};

$(document).ready(function(){
  $('#play_button').on('click', function(){
    Game.browsingChallenge;
    // show marker and center map on it + ensure shows info + remvoe any journey shown
    Display.centerOnUpdatedMarker(Map.latlng, Marker.init, Map.zoomInit);
    Marker.drag(Marker.init);
  });
  $('#submit_answer').on('submit', Answer.submit);
})


//***********************************
// THE GAME
//***********************************

Game = {

  browsingChallenge: function() {
    // THIS REALLY LOOKS LIKE I SHOULD BE USING TEMPLATING!! (but only backbone gives the listeners)

    //Welcome message
    $('#rules_display').text("Browsing Challenge! Get your answer to be able to browse the map again!");
    // mute marker drag, mute whereAmI, mute find location, mute showJourney
    Listeners.gameStarted();
    // turn on .journeyChallenge
    $('#submit_destination').on('submit', Game.journeyChallenge);
    $('#destination_button').on('click', Game.journeyChallenge)
    // finally let the stop button end the game
    $('#stop_button').on('click', Game.stop);

    // Submitting an answer: checks answer PLUS 
    $('#submit_answer').off('submit', Answer.submit);
    $('#submit_answer').on('submit', Game.browsingNextStep);

    // COUNT SCORE!!!!! WILL HAVE TO BE HOOKED WITH THE DB !!!
    
    // answer invalid, MSG: get valid answer to continue, or press Stop Button

  },

  browsingNextStep: function(){
    event.preventDefault();
    
    var answer = $('#answer_input').val();
    Answer.isValid(answer, Answer.isInDictionary, goNextStep);

    function goNextStep(valid){
      if (valid) {
        console.log('next step of the browsing');
        // if good Answer, congrats +1, + allows you to drag pin and find location
        Marker.init.setOptions({draggable: true});
        Map.map.setOptions({draggable: true})
        $('#geocode_button').show();

        // then once dragged or shown, mute again -> it it Game.browsingChallenge() ??
        $('#submit_location').off('submit');
        $('#submit_location').on('submit', Game.browsingChallenge);
        google.maps.event.addListener(Marker.init, 'dragend', Game.browsingChallenge);
      }
      // else the isValid function SHOULD display the right message and we try again
    }
  },

  journeyChallenge: function(){
    event.preventDefault();
    $('#game_msg').text("Journey Challenge! Get your answer right to move one step closer to the final destination!");

    // navigate through the steps
  },

  stop: function(){
    // back to as if the page was loaded
    Listeners.justBrowsing();
    // show marker and center map on it + remvoe any journey shown
    Display.centerOnUpdatedMarker(Map.latlng, Marker.init, Map.zoomInit);
    // end stop button is muted
    $('#stop_button').off('click', Game.stop);    

    // scores are not tracked

  }

};  // End Game Object


//***********************************
// THE LISTENERS FOR THE GAME
//***********************************


Listeners = {

  justBrowsing: function(){
    $('#where_am_i').on('click', Map.setToWhereAmI)
    $('#submit_location').on('submit', Map.setToLocation);
    $('#submit_destination').on('submit', Journey.show);

    //disable journeyChallenge
    $('#submit_destination').off('submit', Game.journeyChallenge);
    $('#destination_button').off('click', Game.journeyChallenge);

    // Update the buttons to reflect we are just browsing through the map
    $('#where_am_i').show();
    $('#geocode_button').show();
    $('#destination_button').val('Show Journey')
    $('#play_button').text('Start Playing!');
    $('#game_msg').text("Click Above to Start Playing and Count Your Score!");

    // markers and map CAN be cliked on and dragged
    if (Marker.init) {Marker.init.setOptions({draggable: true});}
    Map.map.setOptions({draggable: true})
  },

  gameStarted: function(){
    // $('#where_am_i').off('click', Map.setToWhereAmI)
    // $('#submit_location').off('submit', Map.setToLocation);
    // hiding seems the best, let's see if it screws up the styling
    $('#where_am_i').hide();
    $('#geocode_button').hide();
    $('#submit_destination').off('submit', Journey.show);

    // Update the buttons to reflect we are Playing
    $('#play_button').text('Start again');
    $('#destination_button').val('Start Journey Challenge!');
    $('#game_msg').text("Easy Walk Challenge! Get your answer right to be able to browse the map again!");

    // markers and maps cannot be dragged 
    if (Marker.init) {Marker.init.setOptions({draggable: false});}
    Map.map.setOptions({draggable: false})
  }

} // End Listeners Object















