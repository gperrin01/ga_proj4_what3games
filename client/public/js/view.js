var View = View || {};

// ******************************************
// PAGE DISPLAY PROPERTIES AND FUNCTIONS
// ******************************************

View = {

  initialize: function(){
    $('#main-navbar').on('click', 'li', function(){
      $('#main-navbar li').removeClass('active');
      $(this).addClass('active');
      console.log('active')
    })
  },

  // Display the 3 words on the infowindow of a marker
  threeWords: function(coords, marker){
    var data = {
      'key': Keys.w3w_api, // var key = process.env.W3W_KEY;
      'position': coords,
      'lang': 'en'
    };

    $.get("https://api.what3words.com/position", data, function(response){
      var words = response.words.join(' ');
      User.theThreeWords = words;
      console.log(words);

      var star = ' <span class="glyphicon glyphicon-star"></span> ';

      var html = "<div id='the_answer'><p id='three_words'>" + star + words + star + "</p>"
                + "<form id='submit_answer';><input id='answer_input' type='text' autocomplete='off' placeholder='Make the longest word' autofocus/>"
                + "<input type='submit' value='Go' />"
                + "</form>"
                + "<div id='answer_validity' class='text-center'>" 
                + "<p>Use the above words</p><p>To make the longest anagram"
                + "</p></div></div>";

      // show the marker infowindow filled with the 3 words at all time, including when clicking on it
      Marker.infoWindow.setContent(html);
      Marker.infoWindow.open(Map.map, marker);
      // ensure click enables to show the words
      Marker.attachInfo(marker, html);

      // add listener to the submit !!
      google.maps.event.addListener(Marker.infoWindow, 'domready', function(){
        $('#submit_answer').on('submit', function(){
          event.preventDefault();
          Answer.submit();
        })
      });
    });
  },

  // Display the location (based on coordinates) on the input box
  location: function(coords) {
    $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coords, 
      function(result) {
        var text = result.results[0].address_components[0].long_name + ' ' + result.results[0].address_components[1].long_name;
        $('#address_input').val(text);
    })
  },

  // Update marker position to new location + show marker + center map + ensure zoom close
  centerOnUpdatedMarker: function(ggl_coords, marker, zoom) {
    View.clearJourney();
    marker.setMap(Map.map);
    marker.setPosition(ggl_coords);
    Map.map.setCenter(ggl_coords);
    Map.map.setZoom(zoom);

    // finally, clear map of any pins and directions, as we now search for one direction
    Marker.clearStepArray();
    Journey.directionsDisplay.setMap(null);
  },

  clearJourney: function() {
    Journey.directionsDisplay.setMap(Map.map);
    Marker.clearStepArray();
    Marker.init.setMap(null);
  },

  // updates view with the appropriate message &&&
  updateView: function(message, $view, valid) {
    $view.text(message);
    if (valid) {
      View.successStyle(true);
      $('#answer_input').val('');
    } else {
      View.successStyle(false);
    }
  },
  successStyle: function(boolean) {
    $('#answer_validity').removeClass();
    if (boolean) {
      $('#answer_validity').addClass('bg-success text-success')
    }  else {
      $('#answer_validity').addClass('bg-danger text-danger');
    } 
  },

  // render = fully change parent element, 
  // append = add to parent element
  render: function(templateElement, object, parentElement, animation) {
    // parentElement.empty();
    var template = templateElement.html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, object);
    parentElement.html(rendered);

    if (animation === 'slideDown'){
      parentElement.hide();
      parentElement.slideDown('slow');
    }
  },

  append:  function(templateElement, object, parentElement, animation) {
    // parentElement.empty();
    var template = templateElement.html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, object);
    parentElement.append(rendered);
  },

  renderRankings: function(userResponse) {
  //   // Iterate through response and append to the table bodies

  //   for (var i=0; i <= 2 && i < userResponse.top5_score.length; i++){
  //     $('#top_answers').empty();
  //     View.render( $('#top_answers'), userResponse.top5_score[i], $('#rankings_table_template') )
  //   }
  // }
  }
}
