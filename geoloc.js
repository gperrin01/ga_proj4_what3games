// GEOLOC WILL NOT WORK FROM A FILE - NEEDS TO BE A SERVER
var geo = navigator.geolocation;
var geocoder;
var map;

$(document).ready(function(){
  mapInitialize();
  $('#submit_location').on('submit', codeAddressAndWords);
  $('#where_am_i').on('click', get_words_current_pos)
})

// Load map hardcoded with London when the page opens
function mapInitialize() {
  console.log('initializing the map');
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(51.50722, -0.12750);
  var mapOptions = {
    zoom: 12,
    center: latlng
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}


// User wrote an address => pin on the map and 3 words
function codeAddressAndWords() {
  event.preventDefault();
  var address = $('#address_input').val();

  // get a pin on the map with the address input
  geocoder.geocode( {'address': address}, function(results, status) {
    console.log('results', results);
    console.log('status', status);

    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      map.setZoom(16);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
      // fetch the 3 words
      var position = results[0].geometry.location.A + ', ' + results[0].geometry.location.F;
      displayThreeWords(position);

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}


// get W3W to return the words for the current position
function get_words_current_pos() {
  var p1 = new Promise(function(resolve, reject) {
    // return your location using html5 native geolocation
    if(!!geo) {
      console.log('your brower supports geoloc');
      var wpid = geo.getCurrentPosition(resolve, reject, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
    } else {
      console.log("ERROR: Your Browser doesnt support the Geo Location API");
    }
  });

  // once location is grabbed, get the 3 words from w3w
  p1.then(function(val) {
    var position = val.coords.latitude + ', ' + val.coords.longitude;
    displayThreeWords(position);

  }).catch(function() {
    console.log('promise was rejected');
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
    