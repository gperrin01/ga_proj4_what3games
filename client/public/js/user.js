var User = User || {};



// ******************************************
// USER
// ******************************************

var base_url = "http://localhost:3000"

$(document).ready(function(){

  $('#signup').on('submit', function(event){
    event.preventDefault();

    var data = $(this).serialize();
    console.log(data);
    $.post(base_url + '/users')

  })
  
})
