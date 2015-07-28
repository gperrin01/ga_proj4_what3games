// GEOLOC WILL NOT WORK FROM A FILE - NEEDS TO BE A SERVER

// store values in these objects
var Map = Map || {};
var Journey = Journey || {};
var Marker = Marker || {};
var View = View || {};
// var Words = Words || {};


$(document).ready(function(){
  Map.initialize();
})


// ******************************************
// MAP PROPERTIES AND FUNCTIONS
// ******************************************

Map = {

  // Prepare the map iteself
  geo: navigator.geolocation,
  // londonLat: 51.50722,
  londonLat: 51.505831 + Math.random()/100,
  londonLong: -0.132134857 - Math.random()/100,
  // londonLong: -0.12750,
  // Zoom levels
  zoomInit: 13,
  zoomShowLocation: 16,
  zoomStepJourney: 16,
  zoomTeleport: 5,
  zoomMin: 2,

  styleMutedBlue : [{"featureType":"all","stylers":[{"saturation":0},{"hue":"#e7ecf0"}]},{"featureType":"road","stylers":[{"saturation":-70}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"simplified"},{"saturation":-60}]}],

  // ******************************************
  // On page load: map centered in London
  // ******************************************

  initialize: function() {

    // if Game.mode is explore, set a different zoom and random coords in the world
    // no Game.mode means we are in browse or journey and it sticks to london for now
    var zoom = (Game.mode === 'explore') ? Map.zoomTeleport : Map.zoomInit;
    Map.latlng = (Game.mode === 'explore') ? Map.getRandomCoordinates() : new google.maps.LatLng(51.505831 + Math.random()/100, -0.132134857 - Math.random()/100);
    // Map.latlng = (Game.mode === 'explore') ? Map.getRandomCoordinates() : new google.maps.LatLng(Map.londonLat, Map.londonLong);

    // prepare the map
    Map.geocoder = new google.maps.Geocoder();
    var mapOptions = {
      zoom: zoom,
      center: Map.latlng,
      scrollwheel: false,
      // mapTypeControlOptions: {
      //   position: google.maps.ControlPosition.RIGHT_BOTTOM
      // },
      zoomControlOptions: {
        // style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      panControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }, 
      styles: Map.styleMutedBlue
    };
    Map.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // prepare the Google directions API
    Journey.directionsDisplay = new google.maps.DirectionsRenderer();
    Journey.directionsDisplay.setMap(Map.map);

    // add the initial marker (as opposed to any potential Additional marker)
    Marker.init = new google.maps.Marker({
      map: Map.map,
      position: Map.latlng,
      animation: google.maps.Animation.DROP,
      draggable: true,
      icon: Marker.init_icon,
      title: 'Move me around!'
    });
    // listener for when marker being dragged - avoid duplication
    google.maps.event.clearListeners(Marker.init, 'dragend');
    google.maps.event.addListener(Marker.init, 'dragend', function(){
      Marker.drag(this);
    });
    // Instantiate an info window to hold info for the markers 
    Marker.infoWindow = new google.maps.InfoWindow();
    // show the 3 words on the page and on the marker infowindow and display current address
    var coords = Map.latlng.A + ', ' + Map.latlng.F;
    View.threeWords(coords, Marker.init);
    View.location(coords);
  },

  getRandomCoordinates: function() {
    var randomLat = Math.random() * (58 - (-25)) + (-25);  // latitude between +58 and -25
    var randomLong = Math.random() * (120 - (-120)) + (-120); // long between -120 and 120
    return new google.maps.LatLng(randomLat, randomLong);
  },
         
  // ******************************************
  // On entering new address: show new pin on the map, center the map, show location, show 3 words
  // ******************************************

  setToLocation: function() {
    event.preventDefault();
    // get the coordinates of the location typed
    var address = $('#address_input').val();
    Map.geocoder.geocode( {'address': address}, function(results, status) {
      console.log('results', results);

      if (status == google.maps.GeocoderStatus.OK) {
        
        // reposition Marker.init + center map + show location + show words
        var ggl_coords = results[0].geometry.location;
        console.log(ggl_coords)
        View.centerOnUpdatedMarker(ggl_coords, Marker.init, Map.zoomShowLocation);
        View.threeWords(ggl_coords.A + ', ' + ggl_coords.F, Marker.init);
        View.location(ggl_coords.A + ', ' + ggl_coords.F)

      } else alert('Geocode was not successful for the following reason: ' + status);
    });
  },

  // ******************************************
  // On Refresh Current Location: update marker and map on location + show on page + get 3 words
  // ******************************************

  setToWhereAmI: function() {
    // get location using html5 native geolocation and wait for success
    if(!!Map.geo) {
      console.log('your brower supports geoloc');
      $('#three_words_list').text("Just a second while we find your location");
      var wpid = Map.geo.getCurrentPosition(Map.geoloc_success, Map.geoloc_error, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
    } else {
      alert("ERROR: Your Browser doesnt support the Html5 Geo Location API");
    }
  },

  // the 2 callback functions from Map.setToWhereAmI
  geoloc_success: function(val) {
    // once location is grabbed: show 3 words + show location + updater marker + center map
    var coords = val.coords.latitude + ', ' + val.coords.longitude;
    View.threeWords(coords, Marker.init);
    View.location(coords);

    var ggl_coords = new google.maps.LatLng(val.coords.latitude, val.coords.longitude)
    View.centerOnUpdatedMarker(ggl_coords, Marker.init, Map.zoomShowLocation);
  },
  geoloc_error: function(val) {
    console.log('could not get your current location');
  }


}; // End Map Object


// ******************************************
// JOURNEY PROPERTIES AND FUNCTIONS
// ******************************************

Journey = {

  // set the directions API
  directionsService: new google.maps.DirectionsService(),
  selectedMode: 'DRIVING',
  // GOOGLE often returns no_results if i don't specify UK, although i have region=GB in the script
  region: "GB",

  // ******************************************
  // When submitting a destination: show journey including steps
  // ******************************************

  show: function(noop, callback) {
    event.preventDefault();
    console.log('show journey');
    
    // ensure direction display is on and clear out any existing markerArray from previous calculations
    View.clearJourney();

    // create the Google direction request for the route
    var origin = $('#address_input').val();
    var destination = $('#destination_input').val();
    var request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode[Journey.selectedMode],
        region: Journey.region
    };

    Journey.directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        // this creates the line from A to B
        Journey.directionsDisplay.setDirections(response);
        Journey.showSteps(response);

        // when playing journey challenge we call Journey.show(Journey.play)
        // Journey.play will be executed with the route returned by google
        (callback) ? callback(response.routes[0].legs) : console.log('no callback');
      }  
      else alert('Google Route error: ' + status);
    });
  },

  // this adds markers at each steps along the way
  showSteps: function(directionResult) {
    Journey.myRoute = directionResult.routes[0].legs[0];

    for (var i = 0; i < Journey.myRoute.steps.length; i++){
      var step_marker = new google.maps.Marker({
          position: Journey.myRoute.steps[i].start_point,
          map: Map.map
        });
      Marker.stepMarkerArray[i] = step_marker;
      // create the info window which will popup on click on marker
      Marker.attachInfo(step_marker, 'Play the Journey Challenge to unlock this location!');
    }
  }

}; // End Journey Object


// ******************************************
// Listeners on markers
// ******************************************

Marker = {

  stepMarkerArray: [],
  init: '',
  init_icon: 'https://www.agiespana.es/_portal/_widgets/googlemaps/red_marker.png',
  step_icon: "https://www.thruway.ny.gov/travelers/img/questionmark.png",
  succes_icon: "https://es.pinkbike.org/245/sprt/i/trailforks/mapicons/poi_12.png",
  destination: '',
  destination_icon: "",

  // when marker is dragged: update location and 3 words
  // also update the infoWindow
  drag: function(marker){
    var coords = marker.position.A + ', ' + marker.position.F;
    View.threeWords(coords, marker);
    View.location(coords);
  },

  showWords: function(marker){
    var coords = marker.position.A + ', ' + marker.position.F;
    View.threeWords(coords, marker);
  },

  // On click on a marker, it will show info (location and 3 words)
  attachInfo: function(marker, text) {
    // trying to avoid duplication of the same event
    google.maps.event.clearListeners(marker, 'click');
    google.maps.event.addListener(marker, 'click', function() {
      console.log('click');
      Marker.infoWindow.setContent(text);
      Marker.infoWindow.open(Map.map, marker);
    });
  },

  // clear the stepmarkerarray = remove pins used to show a journey
  clearStepArray: function() {
    for (i = 0; i < Marker.stepMarkerArray.length; i++) {
      Marker.stepMarkerArray[i].setMap(null);
    }
  },


  // divide journey is smaller steps and move marker for one to the other
  // origin and destination are ggl_latlng {A: lat, F: long} - start with steps = 100 and delay 10 ms
  transition: function(marker, origin, destination, steps, delay, callback){
    var i = 0;
    var currLat = origin.A;
    var currLng = origin.F;
    var deltaLat = (destination.A - origin.A)/steps;
    var deltaLng = (destination.F - origin.F)/steps;
    moveMarker();

    function moveMarker(){
      currLat += deltaLat;
      currLng += deltaLng;
      var latlng = new google.maps.LatLng(currLat, currLng);
      marker.setPosition(latlng);
      if(i !== steps){
          i++;
          setTimeout(moveMarker, delay);
      } else { 
        if (callback === 'bounce') {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        } 
      }
    };
  }

};  // End Marker Object


