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



//***********************************
// CODE
//***********************************

var Game = Game || {};

$(document).ready(function(){

  $('#play_button').on('click', Game.initialize);
  $('#submit_answer').on('submit', Answer.submitAnswer);
})



Game = {

  initialize: function() {
    //Welcome message
    $('#rules_display').text("Easy Walk Challenge! Get your answer to be able to browse the map again!");
    // mute marker drag, mute whereAmI, mute find location, mute showJourney
    Display.gameStartedListeners();

    // turn on .journeyChallenge
    $('#submit_destination').on('submit', Game.journeyChallenge);
    $('#destination_button').on('click', Game.journeyChallenge)

    // finally let the stop button end the game
    $('#stop_button').on('click', Game.stop);
    // show marker and center map on it + remvoe any journey shown
    Display.centerOnUpdatedMarker(Map.latlng, Marker.init, Map.zoomInit);

    // when isValid answer
    // COUNT SCORE!!!!! WILL HAVE TO BE HOOKED WITH THE DB !!!
    // able to drag pin and find location
    // once dragged or shown, mute again -> it it Game.initialize() ??
    // answer invalid, MSG: get valid answer to continue, or press Stop Button

  },

  stop: function(){
    // back to as if the page was loaded
    Display.justBrowsingListeners();
    // show marker and center map on it + remvoe any journey shown
    Display.centerOnUpdatedMarker(Map.latlng, Marker.init, Map.zoomInit);
    // end stop button is muted
    $('#stop_button').off('click', Game.stop);    

    // scores are not tracked

  },

  journeyChallenge: function(){
    event.preventDefault();
    
    $('#game_msg').text("Journey Challenge! Get your answer right to move one step closer to the final destination!");
  }

}  // End Game Object





















