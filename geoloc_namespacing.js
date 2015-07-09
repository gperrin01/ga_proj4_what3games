// GEOLOC WILL NOT WORK FROM A FILE - NEEDS TO BE A SERVER

// store values in this object
var Map = Map || {};
var Journey = Journey || {};
var Display = Display || {};

// prepare for the markers
var Marker = Marker || {};
var stepMarkerArray = [];
var markerInfo;
var init_marker;
var init_marker_icon = 'http://www.agiespana.es/_portal/_widgets/googlemaps/red_marker.png';
var destination_marker;
var destination_marker_icon = "http://www.veryicon.com/icon/ico/Object/Vista%20Map%20Markers/Map%20Marker%20Chequered%20Flag%20Right%20Chartreuse.ico";


$(document).ready(function(){
  Map.initialize();

  // Event Listeners
  $('#where_am_i').on('click', Map.setToWhereAmI)
  $('#submit_location').on('submit', Map.setToLocation);
  $('#submit_destination').on('submit', Journey.show);
})


// ******************************************
// MAP PROPERTIES AND FUNCTIONS
// ******************************************

Map = {

  // Prepare the map iteself
  geo: navigator.geolocation,
  londonLat: 51.50722,
  londonLong: -0.12750,
  zoomInit: 13,
  zoomShowLocation: 16,

  // ******************************************
  // On page load: map centered in London
  // ******************************************

  initialize: function() {

    // prepare the map
    Map.geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(Map.londonLat, Map.londonLong);
    var mapOptions = {
      zoom: Map.zoomInit,
      center: latlng
    };
    Map.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // prepare the Google directions API
    Journey.directionsDisplay = new google.maps.DirectionsRenderer();
    Journey.directionsDisplay.setMap(Map.map);

    // add the initial marker (as opposed to any potential Additional marker)
    init_marker = new google.maps.Marker({
      map: Map.map,
      position: latlng,
      animation: google.maps.Animation.DROP,
      draggable: true,
      icon: init_marker_icon,
      title: 'Move me around!'
    });
    // set listeners on init_marker
    google.maps.event.addListener(init_marker, 'dragend', dragMaker);
    attachToMarker(init_marker, "testing the marker");

    // Instantiate an info window to hold info for the markers 
    markerInfo = new google.maps.InfoWindow();

    // show the 3 words on the page and on the marker infowindow
    var words = Display.threeWords(Map.londonLat + ', ' + Map.londonLong, init_marker);
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
        
        // reposition init_marker + center map + show location + show words
        var ggl_coords = results[0].geometry.location;
        centerOnUpdatedMarker(ggl_coords, init_marker);
        Display.threeWords(ggl_coords.A + ', ' + ggl_coords.F, init_marker);
        displayLocation(ggl_coords.A + ', ' + ggl_coords.F)

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
      $('#three_words_list').text("Just a second while we get your words");
      var wpid = Map.geo.getCurrentPosition(Map.geoloc_success, Map.geoloc_error, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
    } else {
      alert("ERROR: Your Browser doesnt support the Html5 Geo Location API");
    }
  },

  // the 2 callback functions from Map.setToWhereAmI
  geoloc_success: function(val) {
    // once location is grabbed: show 3 words + show location + updater marker + center map
    var coords = val.coords.latitude + ', ' + val.coords.longitude;
    Display.threeWords(coords, init_marker);
    displayLocation(coords);

    var ggl_coords = new google.maps.LatLng(val.coords.latitude, val.coords.longitude)
    centerOnUpdatedMarker(ggl_coords, init_marker);
  },
  geoloc_error: function(val) {
    console.log('could not get your current location');
  },


}; // End Map Object


// ******************************************
// JOURNEY PROPERTIES AND FUNCTIONS
// ******************************************

Journey = {

  // set the directions API
  directionsService: new google.maps.DirectionsService(),
  selectedMode: 'WALKING',
  // GOOGLE often returns no_results if i don't specify UK, although i have region=GB in the script
  region: "GB",

  // ******************************************
  // When submitting a destination: show journey including steps
  // ******************************************

  show: function() {
    event.preventDefault();

    // ensure direction display is on and clear out any existing markerArray from previous calculations
    Journey.directionsDisplay.setMap(Map.map);
    clearStepMarkerArray();
    init_marker.setMap(null);

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
        console.log('Google route:', response);
        Journey.directionsDisplay.setDirections(response);
        Journey.showSteps(response);

      }  else alert('Google Route error: ' + status);
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
      stepMarkerArray[i] = step_marker;
      // create the info window which will popup on click on marker
      attachToMarker(step_marker, Journey.myRoute.steps[i].instructions);
    }

    // replace icon on the origin and destination markers
    stepMarkerArray[0].setIcon(init_marker_icon);
    // stepMarkerArray[stepMarkerArray.length - 1].setIcon(destination_marker_icon);
  }

} // End Journey Object




// ******************************************
// Listeners on markers
// ******************************************

// when marker is dragged: update location and 3 words
function dragMaker(e){
  coords = this.position.A + ', ' + this.position.F;
  Display.threeWords(coords, this);
  displayLocation(coords);
}

// On click on a marker, it will show info (location and 3 words)
function attachToMarker(marker, text) {
  google.maps.event.addListener(marker, 'click', function() {
    markerInfo.setContent(text);
    markerInfo.open(Map.map, marker);
  });
}

// ******************************************
// Functions to update the look on the page
// ******************************************

// clear the stepmarkerarray = remove pins used to show a journey
function clearStepMarkerArray(){
  for (i = 0; i < stepMarkerArray.length; i++) {
    stepMarkerArray[i].setMap(null);
  }
}

// Update marker position to new location + show marker + center map + ensure zoom close
function centerOnUpdatedMarker(ggl_coords, marker) {
  marker.setMap(Map.map);
  marker.setPosition(ggl_coords);
  Map.map.setCenter(ggl_coords);
  Map.map.setZoom(Map.zoomShowLocation);

  // finally, clear map of any pins and directions, as we now search for one direction
  clearStepMarkerArray();
  Journey.directionsDisplay.setMap(null);
}

// Display the location (based on coordinates) on the input box
// update either the 'origin' box (moving on the map) or the destination box (submitting destination)
function displayLocation(coords) {
  $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coords, 
    function(result) {
      var text = result.results[0].address_components[0].long_name + ' ' + result.results[0].address_components[1].long_name;
      $('#address_input').val(text);
  })
};


// ******************************************
// DISPLAY PROPERTIES AND FUNCTIONS
// ******************************************

Display = {

  // Display the 3 words on the #three_words_list and on the infowindow of a marker
  threeWords: function(coords, marker){
    var data = {
      'key': 'LCJKHHV2', // var key = process.env.W3W_KEY;
      'position': coords,
      'lang': 'en'
    };

    $.get("https://api.what3words.com/position", data, function(response){
      var words = response.words.join(' ');
      console.log(words);
      $('#three_words_list').text('Your 3 words: ' + words);
      attachToMarker(marker, words);
      return words
    });
    }

}



    