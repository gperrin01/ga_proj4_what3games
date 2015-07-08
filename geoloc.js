// GEOLOC WILL NOT WORK FROM A FILE - NEEDS TO BE A SERVER
var geo = navigator.geolocation;
var geocoder;
var map;
var init_marker;
var zoomInit = 13;
var zoomShowLocation = 16;

$(document).ready(function(){
  mapInitialize();
  $('#submit_location').on('submit', codeAddressAndWords);
  $('#where_am_i').on('click', get_words_current_pos)
})

// Load map hardcoded with London when the page opens
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
    icon: 'http://www.agiespana.es/_portal/_widgets/googlemaps/red_marker.png',
    title: 'Move me around!'
  });

  // listener to update location and 3 words when the marker is dragged
  google.maps.event.addListener(init_marker, 'dragend', function(event){
    position = this.position.A + ', ' + this.position.F;
    displayThreeWords(position);
    displayLocation(position);
  });

  // show the 3 words
  displayThreeWords(londonLat + ', ' + londonLong);

  // LATER add infowindow to the marker with 3 words and location
}


// User wrote an address => pin on the map and 3 words
function codeAddressAndWords() {
  event.preventDefault();
  var address = $('#address_input').val();

  // get the coordinates of the location typed
  geocoder.geocode( {'address': address}, function(results, status) {
    console.log('results', results);
    console.log('status', status);

    if (status == google.maps.GeocoderStatus.OK) {

      var location = results[0].geometry.location;
      // reposition the marker and center the map
      centerOnUpdatedMarker(location);
      // fetch the 3 words
      displayThreeWords(location.A + ', ' + location.F);

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}


// update the map with current location + show on page + get W3W to return the words
function get_words_current_pos() {
  var p1 = new Promise(function(resolve, reject) {
    // get location using html5 native geolocation
    if(!!geo) {
      console.log('your brower supports geoloc');
      var wpid = geo.getCurrentPosition(resolve, reject, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
    } else {
      console.log("ERROR: Your Browser doesnt support the Geo Location API");
    }
  });

  // once location is grabbed, update the map and the words
  p1.then(function(val) {
    // update the w3w
    var position = val.coords.latitude + ', ' + val.coords.longitude;
    displayThreeWords(position);

    // reposition the marker and center the map
    var location = new google.maps.LatLng(val.coords.latitude, val.coords.longitude)
    centerOnUpdatedMarker(location);

    // update text on page


  }).catch(function() {
    console.log('promise was rejected');
  })
}

function centerOnUpdatedMarker(location) {
  map.setCenter(location);
  map.setZoom(zoomShowLocation);
  init_marker.setPosition(location);
}

// Display the location (based on coordinates) on the input box
function displayLocation(location) {
  $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position, 
    function(result) {
      var text = result.results[0].address_components[0].long_name + ' ' + result.results[0].address_components[1].long_name;
      $('#address_input').val(text);
      console.log(text);
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
    