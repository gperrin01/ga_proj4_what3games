var View = View || {};

$(document).ready(function(){
  View.initialize();
  $('#main_row_header').on('click', '#ranking', View.toggleRankings);
}); 

// ******************************************
// PAGE DISPLAY PROPERTIES AND FUNCTIONS
// ******************************************

View = {

  initialize: function(){
    $('#main-navbar').on('click', 'li', function(){
      $('#main-navbar li').removeClass('active');
      $(this).addClass('active');
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
      var html = "<div id='the_answer' class='text-center'><p id='three_words'>" + star + words + star + "</p>"
                + "<form id='submit_answer'><input id='answer_input' type='text' autocomplete='off' placeholder='Make the longest word' autofocus/>"
                + "<input type='submit' value='Go' />"
                + "</form>"
                + "<div id='answer_validity'>" 
                + "<p>Use the above words</p><p>To make the longest anagram"
                + "</p></div></div>";

      // show the marker infowindow filled with the 3 words at all time, including when clicking on it
      Marker.infoWindow.setContent(html);
      Marker.infoWindow.open(Map.map, marker);
      // ensure click enables to show the words
      Marker.attachInfo(marker, html);

      // if gameType is journey, listener should be defined already in the journey
      // if no gameType, add the Listener here
      console.log('gameType is', Game.mode);
      google.maps.event.clearListeners(Marker.infoWindow, 'domready');

      var mode = {'browse': null, 'explore': Game.exploreNext, 'journey': JourneyChallenge.moveAlongJourney};

      google.maps.event.addListener(Marker.infoWindow, 'domready', function(){
          $('#submit_answer').on('submit', function(){
            event.preventDefault();
            console.log('submit', Game.mode)
            Answer.submit(mode[Game.mode]);
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
    console.log('center on marker');
    console.log('working center on updated marker', ggl_coords)
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
  answerValidity: function(message, $view, valid) {
    $view.text(message);
    if (valid) {
      View.successStyle(true);
      console.log('success update view');
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

  submitForm: function(type, variable){
    var html;
    if (type === 'answer') {
      html = "<input id='answer_input' type='text' autocomplete='off' placeholder='Make the longest word' autofocus/>"
                + "<input type='submit' value='Go' />";
    } else if (type === 'no location') {
      html = "<input type='button' class='btn btn-info'"  
                + "value='No location with that combination. Click to be transported to a random part of the world'>";
    } else if (type === 'move marker') {
      html = "<input type='button' class='btn btn-info' value='Move the marker to your " +variable+ " location!'>";
    } else if (type === 'teleport to') {
      html = "<input type='button' class='btn btn-info'"
                + "value='Three right answers! Click here to be transported to &#34;" +variable+ "&#34;'>";
    }
    $('#submit_answer').html(html);
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

  // show Rankings on 'click', then ensure any click on body will hide Rankings
  toggleRankings: function() {
    event.preventDefault();

    if ($('#ranking_col').hasClass('out')) { 

      $('#ranking_col').removeClass('out').addClass('fade in');

      console.log('prepare rankings');
      // send the current_user auth token and receive his rankings as well as the global rankings
      // top 5 w most points + top 5 with best ever answer + top 5 best at this lcoation
      // data will show "  one two three"
      var data = {words: $('#three_words').text().split(' ').slice(2,5).join(' ')};
      $.ajax({
        type: 'GET',
        url: base_url + "/users/" + User.currentUser.authentication_token + "/ranking",
        data: data,
        dataType: 'json' 
      }).done(function(response){
        console.log('rankings', response);

        var userRanks = {
          totalPoints: response.user_points,
          ranking: response.user_rank,
          rank_here: response.user_rank_here,
          nick: User.currentUser.splitEmail,
          nUsers: response.n_users,
          myBest: response.my_best
        };
        // top3 scores
        userRanks.topScores1mail = response.top3_score.length > 0 ? response.top3_score[0][0].split('@')[0] : 'n/a';
        userRanks.topScores1points = response.top3_score.length > 0 ? response.top3_score[0][1] : 'n/a';
        userRanks.topScores2mail = response.top3_score.length > 1 ? response.top3_score[1][0].split('@')[0] : 'n/a';
        userRanks.topScores2points = response.top3_score.length > 1 ? response.top3_score[1][1] : 'n/a';
        userRanks.topScores3mail = response.top3_score.length > 2 ? response.top3_score[2][0].split('@')[0] : 'n/a';
        userRanks.topScores3points = response.top3_score.length > 2 ? response.top3_score[2][1] : 'n/a';
        // top3 answers
        userRanks.topAnswers1mail = response.top3_answers.length > 0 ? response.top3_answers[0][0].split('@')[0] : 'n/a';
        userRanks.topAnswers1points = response.top3_answers.length > 0 ? response.top3_answers[0][1] : 'n/a';
        userRanks.topAnswers2mail = response.top3_answers.length > 1 ? response.top3_answers[1][0].split('@')[0]: 'n/a';
        userRanks.topAnswers2points = response.top3_answers.length > 1 ? response.top3_answers[1][1] : 'n/a';
        userRanks.topAnswers3mail = response.top3_answers.length > 2 ? response.top3_answers[2][0].split('@')[0]: 'n/a';
        userRanks.topAnswers3points = response.top3_answers.length > 2 ? response.top3_answers[2][1] : 'n/a';
        // top3 answers here
        userRanks.topHere1mail = response.top3_here.length > 0 ? response.top3_here[0][0].split('@')[0] : 'n/a';
        userRanks.topHere1points = response.top3_here.length > 0 ? response.top3_here[0][1] : 'n/a';
        userRanks.topHere2mail = response.top3_here.length > 1 ? response.top3_here[1][0].split('@')[0]: 'n/a';
        userRanks.topHere2points = response.top3_here.length > 1 ? response.top3_here[1][1] : 'n/a';
        userRanks.topHere3mail = response.top3_here.length > 2 ? response.top3_here[2][0].split('@')[0]: 'n/a';
        userRanks.topHere3points = response.top3_here.length > 2 ? response.top3_here[2][1] : 'n/a'

        // Now render the Ranking view
        View.render( $('#rankings_template'), userRanks, $('#rankings_zone'));

        // Ensure clicking on the body will hide the rankings, and that this click is only listened to once
        $('body').one('click', function(){
          $('#ranking_col').removeClass('in').addClass('fade out');
        });

      });
    } else {
      $('#ranking_col').removeClass('in').addClass('fade out');
    }
  }

}
