// GEOLOC WILL NOT WORK FROM A FILE - NEEDS TO BE A SERVER

var geo = navigator.geolocation;
var geocoder;
var map;

var zoomInit = 13;
var zoomShowLocation = 16;

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

  geocoder = new google.maps.Geocoder();
  var londonLat = 51.50722;
  var londonLong = -0.12750;
  var latlng = new google.maps.LatLng(londonLat, londonLong);
  var mapOptions = {
    zoom: zoomInit,
    center: latlng
  };
  // show the map
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // add the initial marker (as opposed to any potential future Additional marker)
  init_marker = new google.maps.Marker({
    map: map,
    position: latlng,
    animation: google.maps.Animation.DROP,
    draggable: true,
    icon: init_marker_icon,
    title: 'Move me around!'
  });
  // **
  // listener to update location and 3 words when the marker is dragged
  // **
  google.maps.event.addListener(init_marker, 'dragend', function(event){
    position = this.position.A + ', ' + this.position.F;
    displayThreeWords(position);
    displayLocation(position, origin);
  });

  // show the 3 words
  displayThreeWords(londonLat + ', ' + londonLong);
  // LATER add infowindow to the marker with 3 words and location
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

      var location = results[0].geometry.location;
      // reposition marker + center map + show location + show words
      centerOnUpdatedMarker(location);
      displayThreeWords(location.A + ', ' + location.F);
      displayLocation(location.A + ', ' + location.F, 'origin')

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
  var position = val.coords.latitude + ', ' + val.coords.longitude;
  displayThreeWords(position, 'origin');
  displayLocation(position, 'origin');

  var location = new google.maps.LatLng(val.coords.latitude, val.coords.longitude)
  centerOnUpdatedMarker(location);
}
function geoloc_error(val){
  console.log('could not get your current location');
}

// ******************************************
// When submitting a destination
// ******************************************

function showJourney(){
  event.preventDefault();
  var origin = $('#address_input').val();
  var destination = $('#destination_input').val();
  console.log(origin);
  console.log(destination);
  // debugger
  var url = "https://maps.googleapis.com/maps/api/directions/json?origin=" +origin+ "&destination=" +destination;
  $.get(url, function(result){
    console.log('result ', result);
  })

// origin=Chicago,IL&destination=Los+Angeles,CA
// &waypoints=Joplin,MO|Oklahoma+City,OK&key=API_KEY

  console.log(this);
}


// ******************************************
// Functions to update the look on the page
// ******************************************

// Update marker position to new location and center the map and ensure zoon close
function centerOnUpdatedMarker(location) {
  map.setCenter(location);
  map.setZoom(zoomShowLocation);
  init_marker.setPosition(location);
}

// Display the location (based on coordinates) on the input box
function displayLocation(location, type) {
  $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + location, 
    function(result) {
      var text = result.results[0].address_components[0].long_name + ' ' + result.results[0].address_components[1].long_name;
      // update the 'origin' box (moving on the map) or the destination box (submitting destination)
      (type === 'destination') ? $('#destination_input').val(text) : $('#address_input').val(text);
  })
}

// Display the 3 words on the #3_words_list
function displayThreeWords(position){
  var data = {
    'key': 'LCJKHHV2', // var key = process.env.W3W_KEY;
    'position': position,
    'lang': 'en'
  };
  $.get("https://api.what3words.com/position", data, function(response){
    console.log(response.words.join(' '));
    $('#3_words_list').text('Your 3 words: ' + response.words.join(' '));
  });
}
    