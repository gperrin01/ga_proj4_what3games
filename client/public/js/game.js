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

  $('#play_button').on('click', Game.initialize)
  $('#submit_answer').on('submit', Answer.submitAnswer)
})



Game = {

  initialize: function() {
    // message: "Easy Walk Challenge! Get your answer to be able to browse the map again!"
    $('#rules_display').text("Easy Walk Challenge! Get your answer to be able to browse the map again!");

    // change Play button into Re-start from beginning
    // Need to reset stuffs?
    $('#play_button').text('Start again');

    // mute marker drag, mute whereAmI, mute find location
    $('#submit_location').off('submit');
    $('#where_am_i').off('click');
    google.maps.event.clearListeners(Marker.init);
   
    // show marker and center map on it + remvoe any journey shown
    Display.centerOnUpdatedMarker(Map.latlng, Marker.init, Map.zoomInit)

    // submit destination starts the "Journey Challenge!"
    Journey.directionsDisplay.setMap(null);

    // when isValid answer
    // COUNT SCORE!!!!! WILL HAVE TO BE HOOKED WITH THE DB !!!
    // able to drag pin and find location
    // once dragged or shown, mute again -> it it Game.initialize() ??

    // answer invalid, MSG: get valid answer to continue, or press Stop Button






    // finally let the stop button end the game
    $('#stop_button').on('click', Game.stop)
  },


  stop: function(){
  // clear any journey shown ?
  // marker can be dragged, whereAmI and locations and destinations can be submitted
  // scores are not tracked

  // play button shows play
  $('#play_button').text('Start Playing!')

  },

  journeyChallenge: function(){

  }

}  // End Game Object





















