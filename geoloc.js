// GEOLOC WILL NOT WORK FROM A FILE - NEEDS TO BE A SERVER

var geo = navigator.geolocation
$(document).ready(function(){
  // init_geo();
  $('#test').on('click', init_geo_promise)
})

function init_geo_promise() {

  var p1 = new Promise(function(resolve, reject) {

    console.log('promise started');
    if(!!geo) {
      console.log('your brower supports geoloc');
      var wpid = geo.watchPosition(resolve, reject, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
    } else {
      console.log("ERROR: Your Browser doesnt support the Geo Location API");
    }
  });

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


