var geocoder;
var map;

function initialize() {
  console.log('initializing the map');
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(-34.397, 150.644);
  var mapOptions = {
    zoom: 8,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function codeAddress() {
  console.log('geocoding');
  var address = $('#address_input').val();
  geocoder.geocode( { 'address': address}, function(results, status) {

    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

// google.maps.event.addDomListener(window, 'load', initialize);
//is that the same as doc ready

$(document).ready(function(){
  initialize();
  $('#submit_location').on('submit', codeAddress);
})
