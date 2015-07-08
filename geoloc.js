// GEOLOC WILL NOT WORK FROM A FILE - NEEDS TO BE A SERVER
var geo = navigator.geolocation;
var geocoder;
var map;

$(document).ready(function(){
  map_initialize();
  $('#submit_location').on('submit', codeAddress);
  $('#where_am_i').on('click', get_words_current_pos)
})

// Load map hardcoded with London when the page opens
function map_initialize() {
  console.log('initializing the map');
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(51.50722, -0.12750);
  var mapOptions = {
    zoom: 12,
    center: latlng
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

// Set pin on the map based on user input
function codeAddress() {
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
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}


// get W3W to return the words for the current position
function get_words_current_pos() {

  return new Promise(function(resolve, reject) {

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
    console.log('promise finishd return position', val);
    // Convert position into W3W words
    var data = {
      'key': 'LCJKHHV2', // var key = process.env.W3W_KEY;
      'position': val.coords.latitude + ', ' + val.coords.longitude,
      'lang': 'en'
    };

    $.get("https://api.what3words.com/position", data, function(response){
      console.log(response.words.join(' '));
      $('#1').text(response.words[0]);
      $('#2').text(response.words[1]);
      $('#3').text(response.words[2]);
    });

    // // get the available languages
    // $.get('https://api.what3words.com/get-languages?key='+ data.key, function(response) {
    //   console.log(response);
    // });

  }).catch(function() {
    $('#2').text('promise rejected!')
    console.log('promise was rejected');
  })
}


