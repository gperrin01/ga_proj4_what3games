$(document).ready(function(){
  $('#submit_answer').on('submit', submitAnswer)
})

function submitAnswer(){
  event.preventDefault();

  console.log('this is', this);
  var answer = $('#answer_input').val();

  $.get("", function(result){
    console.log('in dic', result);
  })



}


var Answer = Answer || {};

Answer = {

  compareWith: "belt parts remain",

  // // Return true if all checks pass, return error msg at first error
  isValid: function(answer) {

    if (!Answer.isLongEnough(answer)) {
     alert('Invalid, answer must be three or more characters.');
     return false
    }
    else if (!Answer.isNotOneOfThree(answer)) {
      alert('Invalid, answer cannot be one of the three words.');
      return false
    }
    else if (!Answer.isNotBasicPlural(answer)) {
      alert('Invalid, you cannot simply pluralize one of the three words');
      return false
    }
    else if (!Answer.isNotBasicSingular(answer)) {
      alert('Invalid, you cannot take the simple singular form of one of the three words');
      return false
    }   
    else if (!Answer.hasValidLetters(answer)) {
      alert('Invalid, answer contains a letter not present in any of the three words');
      return false
    }
    else if (!Answer.hasValidNumberOfLetters(answer)) {
      // alert("Invalid, a letter can only be used multiple times if it present multiple times in the three words");
      return false
    }

    return true;
  },

  // is in the dictionary?
  isInDictionary: function(answer){
    console.log('before ajax');
    $.get("https://www.google.com/#q=define+" + answer, function(result){
      console.log('in dic', result);
    })
  },

  // answer must be three or more characters
  isLongEnough: function(answer) {
    return (answer.length > 2)
  },

  // true if answer NOT inside of Answer.compareWith
  isNotOneOfThree: function(answer) {
    return Answer.compareWith.indexOf(answer) === -1
  },

  // remove last letter from answer and check result isn't one of the 3 words
  isNotBasicPlural: function(answer) {
    return Answer.isNotOneOfThree( answer.slice(0,-1) );
  },
  // add a final 's' to word and check result isn't of the 3 words
  isNotBasicSingular: function(answer) {
    return Answer.isNotOneOfThree(answer + 's');
  },

  // Iterate through the letters of the answer and return error if one isn't present in the three wods
  hasValidLetters: function(answer) {
    for (var i = 0; i < answer.length; i++) {
      var str = answer.charAt(i);
      if (Answer.compareWith.indexOf(str) === -1) {
        alert('Invalid, "' + str + '" is not present in ' + Answer.compareWith)
        return false;
      }
    }
    return true;
  },

  // Iterate through the letters of the answer and count their occurences
  // return error if it is higher than the occurences of that letter in the combined three words
  hasValidNumberOfLetters: function(answer) {
    for (var i = 0; i < answer.length; i++) {
      var str = answer.charAt(i);
      var countInAnswer = answer.match(new RegExp(str, "g") || [] ).length
      var countInThreeWords = Answer.compareWith.match(new RegExp(str, "g") || [] ).length
      if (countInAnswer > countInThreeWords) {
        var text = (countInThreeWords > 1) ? ' times' : ' time';
        alert('Invalid, "' +str+ '" is only present ' + countInThreeWords + text + ' in ' + Answer.compareWith  )
        return false
      }
      // sweet way found: returns an array with all occurences of the regexp
      // need create a new regexps as I cannot hardoce, as in eg for 'o': str.match(/o/g).length
      // add || [] because regexp return null if no matches
    }
    return true
  }

}  // End Answer Object




























