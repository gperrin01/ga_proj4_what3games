// GEOLOC WILL NOT WORK FROM A FILE - NEEDS TO BE A SERVER

var geo = navigator.geolocation;
var geocoder;
var map;
// where the map will be centered on page load
var londonLat = 51.50722;
var londonLong = -0.12750;
var zoomInit = 13;
var zoomShowLocation = 16;
// set the directions API
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var selectedMode = 'WALKING';
// markers
var stepMarkerArray = [];
var markerInfo;
var init_marker;
var init_marker_icon = 'http://www.agiespana.es/_portal/_widgets/googlemaps/red_marker.png';
var destination_marker;
var destination_marker_icon = "http://www.veryicon.com/icon/ico/Object/Vista%20Map%20Markers/Map%20Marker%20Chequered%20Flag%20Right%20Chartreuse.ico";


$(document).ready(function(){
  mapInitialize();

  // Event Listeners
  $('#where_am_i').on('click', setMapToWhereAmI)
  $('#submit_location').on('submit', setMapToLocation);
  $('#submit_destination').on('submit', showJourney);
})

// ******************************************
// On page load: map centered in London
// ******************************************

function mapInitialize() {
  console.log('initializing the map');

  // prepare the map
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(londonLat, londonLong);
  var mapOptions = {
    zoom: zoomInit,
    center: latlng
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // prepare the Google directions API
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  // add the initial marker (as opposed to any potential Additional marker)
  init_marker = new google.maps.Marker({
    map: map,
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
  var words = displayThreeWords(londonLat + ', ' + londonLong, init_marker);
}

// ******************************************
// Listeners on markers
// ******************************************

// when marker is dragged: update location and 3 words
function dragMaker(e){
  coords = this.position.A + ', ' + this.position.F;
  displayThreeWords(coords);
  displayLocation(coords, 'origin');
}

// On click on a marker, it will show info (location and 3 words)
function attachToMarker(marker, text) {
  google.maps.event.addListener(marker, 'click', function() {
    markerInfo.setContent(text);
    markerInfo.open(map, marker);
  });
}

// ******************************************
// On entering new address: show new pin on the map, center the map, show location, show 3 words
// ******************************************

function setMapToLocation() {
  event.preventDefault();

  // get the coordinates of the location typed
  var address = $('#address_input').val();
  geocoder.geocode( {'address': address}, function(results, status) {
    console.log('results', results);
    console.log('status', status);

    if (status == google.maps.GeocoderStatus.OK) {
      
      // reposition marker + center map + show location + show words
      var ggl_coords = results[0].geometry.location;
      centerOnUpdatedMarker(ggl_coords, init_marker);
      displayThreeWords(ggl_coords.A + ', ' + ggl_coords.F);
      displayLocation(ggl_coords.A + ', ' + ggl_coords.F, 'origin')

    } else alert('Geocode was not successful for the following reason: ' + status);
  });
}

// ******************************************
// On Refresh Current Location: update marker and map on location + show on page + get 3 words
// ******************************************

function setMapToWhereAmI() {
  // get location using html5 native geolocation and wait for success
  if(!!geo) {
    console.log('your brower supports geoloc');
    $('#3_words_list').text("Just a second while we get your words");
    var wpid = geo.getCurrentPosition(geoloc_success, geoloc_error, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
  } else {
    console.log("ERROR: Your Browser doesnt support the Geo Location API");
  }
}

// the 2 callback functions from setMapToWhereAmI
function geoloc_success(val){
  // once location is grabbed: show 3 words + show location + updater marker + center map
  var coords = val.coords.latitude + ', ' + val.coords.longitude;
  displayThreeWords(coords, 'origin');
  displayLocation(coords, 'origin');

  var ggl_coords = new google.maps.LatLng(val.coords.latitude, val.coords.longitude)
  console.log('google lt ln', ggl_coords);
  centerOnUpdatedMarker(ggl_coords, init_marker);
}
function geoloc_error(val){
  console.log('could not get your current location');
}

// ******************************************
// When submitting a destination: show journey including steps
// ******************************************

function showJourney(){
  event.preventDefault();

  // ensure direction display is on and clear out any existing markerArray from previous calculations
  directionsDisplay.setMap(map);
  clearStepMarkerArray();
  init_marker.setMap(null);

  // create the Google direction request for the route
  var origin = $('#address_input').val();
  var destination = $('#destination_input').val();
  var request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode[selectedMode]
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      // this creates the line from A to B
      directionsDisplay.setDirections(response);
      console.log(response);
      showSteps(response);

    }  else alert('Google Route error: ' + status);
  });
}

// this adds markers at each steps along the way
function showSteps(directionResult){
  var myRoute = directionResult.routes[0].legs[0];

  for (var i = 0; i < myRoute.steps.length; i++){
    var step_marker = new google.maps.Marker({
        position: myRoute.steps[i].start_point,
        map: map
      });
    stepMarkerArray[i] = step_marker;
    // create the info windos which will popup on click on marker
    attachToMarker(step_marker, myRoute.steps[i].instructions);
  }
  // replace icon on the origin and destination markers
  stepMarkerArray[0].setIcon(init_marker_icon);
  // stepMarkerArray[stepMarkerArray.length - 1].setIcon(destination_marker_icon);
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
  map.setCenter(ggl_coords);
  map.setZoom(zoomShowLocation);
  marker.setPosition(ggl_coords);
  marker.setMap(map);

  // finally, clear map of any pins and directions, as we now search for one direction
  clearStepMarkerArray();
  directionsDisplay.setMap(null);
}

// Display the location (based on coordinates) on the input box
// update either the 'origin' box (moving on the map) or the destination box (submitting destination)
function displayLocation(coords, type) {
  $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coords, 
    function(result) {
      var text = result.results[0].address_components[0].long_name + ' ' + result.results[0].address_components[1].long_name;
      (type === 'destination') ? $('#destination_input').val(text) : $('#address_input').val(text);
  })
}

// Display the 3 words on the #3_words_list and on the infowindow of a marker
function displayThreeWords(coords, marker){
  var data = {
    'key': 'LCJKHHV2', // var key = process.env.W3W_KEY;
    'position': coords,
    'lang': 'en'
  };

  $.get("https://api.what3words.com/position", data, function(response){
    var words = response.words.join(' ');
    console.log(words);
    $('#3_words_list').text('Your 3 words: ' + words);
    attachToMarker(marker, words);
    return words
  });
}
    