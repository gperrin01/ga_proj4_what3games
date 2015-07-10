$(document).ready(function(){
  $('#submit_answer').on('submit', submitAnswer)
})

function submitAnswer(){
  event.preventDefault();

  var answer = $('#answer_input').val();
  return Answer.isValid(answer)
}


var Answer = Answer || {};

Answer = {

  // hardcode French translation for the moment
  langTranslate: {
   'French': { short: "fr", full: 'French' },
   'Spanish': { short: "sp", full: 'Spanish' },
   'Italian': { short: "it", full: 'Italian' },
   'German': { short: "de", full: 'German' },
   genre: {'m': 'masculine', 'f': 'feminine', 'n': 'neutral'}
  },

  // Run all logic tests first & if the pass run the Dictionnary test
  // if Dic test ok, display the value coming from the dictionnary
  isValid: function(answer) {

    if (!Answer.isLongEnough(answer)) {
     $('#answer_validity').text('Try again, less than three characters is too easy!');
     return false
    }
    else if (!Answer.isNotOneOfThree(answer)) {
      $('#answer_validity').text('Try again, choosing a part of the three words is too easy!');
      return false
    }
    else if (!Answer.isNotBasicPlural(answer)) {
      $('#answer_validity').text('Try again, pluralizing one of the words is too easy!');
      return false
    }
    else if (!Answer.isNotBasicSingular(answer)) {
      $('#answer_validity').text('Try again, taking the singular of one of the words is too easy!');
      return false
    }   
    else if (!Answer.hasValidLetters(answer)) {
      // $('#answer_validity').text('Try again, taking letters out');
      return false
    }
    else if (!Answer.hasValidNumberOfLetters(answer)) {
      // $('#answer_validity').text("Try again, a letter can only be used multiple times if it present multiple times in the three words");
      return false
    }
    // if all checks pass we run the Dictionary check and display the results if it passes too
    else return (Answer.isInDictionary(answer)) 
  },

  // ******************************
  // Answer validity functions below
  // ******************************

  isInDictionary: function(answer){

    var data = {
      key: Keys.yandex_dic,
      lang: "en-" + Answer.langTranslate['Italian'].short,
      text: answer
    };

    $.get("https://dictionary.yandex.net/api/v1/dicservice.json/lookup?", data, function(result){

      if (result.def.length > 0) {
        var answer = result.def[0].text;
        var traduction = result.def[0].tr[0];
        var tradText = 'In ' + Answer.langTranslate['Italian'].full + ' it is "';
        var genre = (traduction.gen) ? (', ' + Answer.langTranslate.genre[traduction.gen] + ')' ) : (')');
        tradText += traduction.text + '" (' + traduction.pos + genre;

        $('#answer_validity').text('Well done! ' + tradText);

        var points = answer.length;
        return true;
      }
      else {
        $('#answer_validity').text("Try again, this word is not in our dictionary!");
        return false
      }
    })
  },

  // answer must be three or more characters
  isLongEnough: function(answer) {
    return (answer.length > 2)
  },

  // true if answer NOT inside of Words.theThreeWords
  // Words.theThreeWords.indexOf(answer) is not good as it would block substrings of the words
  // we only block Full Matches
  isNotOneOfThree: function(answer) {
    return Words.theThreeWords.indexOf(answer) === -1
  },

  // if answer's last letter is an 's' remove it and check result isn't one of the 3 words
  isNotBasicPlural: function(answer) {
    return (answer.charAt(answer.length - 1) === 's') ? Answer.isNotOneOfThree( answer.slice(0,-1) ) : true
    // return Answer.isNotOneOfThree( answer.slice(0,-1) );
  },
  // add a final 's' to word and check result isn't of the 3 words
  isNotBasicSingular: function(answer) {
    return Answer.isNotOneOfThree(answer + 's');
  },

  // Iterate through the letters of the answer and return error if one isn't present in the three wods
  hasValidLetters: function(answer) {
    for (var i = 0; i < answer.length; i++) {
      var str = answer.charAt(i);
      if (Words.theThreeWords.indexOf(str) === -1) {
        $('#answer_validity').text('Try again, "' + str + '" is not present in ' + Words.theThreeWords)
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
      var countInThreeWords = Words.theThreeWords.match(new RegExp(str, "g") || [] ).length
      if (countInAnswer > countInThreeWords) {
        var text = (countInThreeWords > 1) ? ' times' : ' time';
        $('#answer_validity').text('Try again, "' +str+ '" is only present ' + countInThreeWords + text + ' in ' + Words.theThreeWords  )
        return false
      }
      // sweet way found: returns an array with all occurences of the regexp
      // need create a new regexps as I cannot hardoce, as in eg for 'o': str.match(/o/g).length
      // add || [] because regexp return null if no matches
    }
    return true
  }

}  // End Answer Object




























