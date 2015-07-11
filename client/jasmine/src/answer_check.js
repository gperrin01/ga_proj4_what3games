
//***********************************
// LOGIC TO CHECK IF AN ANSWER IS VALID
//***********************************

var Answer = Answer || {};

Answer = {

  // options for the word lookup and translatin
  // hardcode French translation for the moment
  langTranslate: {
   'French': { short: "fr", full: 'French' },
   'Spanish': { short: "sp", full: 'Spanish' },
   'Italian': { short: "it", full: 'Italian' },
   'German': { short: "de", full: 'German' },
   genre: {'m': 'masculine', 'f': 'feminine', 'n': 'neutral'}
  },

  // this is the basic submit check for freely moving on the map
  // for the more advanced checks while in Game, see Game.browsingNextSteps
  submit: function(){
    event.preventDefault();
    var answer = $('#answer_input').val();
    // callback function after isValid to start the dictionnary thing
    Answer.isValid(answer, Answer.isInDictionary);
  },

  // Run all logic tests first & if they pass run the Dictionnary test
  // if Dic test ok, display the value coming from the dictionnary
  isValid: function(answer, callbackOne, callbackForInDico) {
    var message;
    var valid;

    if (!Answer.isLongEnough(answer)) {
      message = "Try again, less than three characters is too easy!";
      valid = false;
    }
    else if (!Answer.isNotOneOfThree(answer)) {
      message = 'Try again, choosing a part of the three words is too easy!';
      valid = false;
    }
    else if (!Answer.isNotBasicPlural(answer)) {
      message = 'Try again, pluralizing one of the words is too easy!';
      valid = false;
    }
    else if (!Answer.isNotBasicSingular(answer)) {
      message = 'Try again, taking the singular of one of the words is too easy!';
      valid = false;
    }   
    else if (typeof Answer.hasValidLetters(answer) === "string") {
      message = Answer.hasValidLetters(answer);
      valid = false;
    }
    else if (typeof Answer.hasValidNumberOfLetters(answer) === "string") {
      message = Answer.hasValidNumberOfLetters(answer);
      valid = false;
    }

    // if valid is false, display relevant message and return FALSE to isValid
    if (valid === false) { 
      var $view = $('#answer_validity');
      return Display.updateView(message, $view, valid);
    } 
    // else (valid still undefined) run the isInDico WITH CALLBACK
    else {  return callbackOne(answer, callbackForInDico)  }
  },

  isInDictionary: function(answer, callback){

    var $view = $('#answer_validity');

    var data = {
      key: Keys.yandex_dic,
      lang: "en-" + Answer.langTranslate['Italian'].short,
      text: answer
    };

    $.get("https://dictionary.yandex.net/api/v1/dicservice.json/lookup?", data, function(result){

      if (result.def.length === 0) {
        Display.updateView("Try again, this word is not in our dictionary!", $view, false);
        // this is the callback enabling the Game to know the result is FALSE
        if (callback) {callback(false);}
      }
      else {
        console.log(result.def[0]);
        var answer = result.def[0].text;
        var traduction = result.def[0].tr[0];
        var tradText = 'In ' + Answer.langTranslate['Italian'].full + ', "'+answer+ ' is "';
        var genre = (traduction.gen) ? (', ' + Answer.langTranslate.genre[traduction.gen] + ')' ) : (')');
        tradText += traduction.text + '" (' + traduction.pos + genre;

        // $('#answer_validity').text('Well done! ' + tradText + '<br> Move the pin to go to the next challenge!');
        // add how many points??
        var points = answer.length;
        Display.updateView('Well done! ' + tradText, $view, true)

        // this is the callback enabling the Game to know the result is TRUE
        if (callback) {callback(true);}
      }
    });
  },

  
  // ******************************
  // Answer validity functions below
  // ******************************
  
  // answer must be three or more characters
  isLongEnough: function(answer) {
    return (answer.length > 2)
  },

  // true if answer NOT inside of Words.theThreeWords
  // Words.theThreeWords.indexOf(answer) is not good as it would block substrings of the words
  // we only block Full Matches
  isNotOneOfThree: function(answer) {
    return Words.theThreeWords.split(' ').indexOf(answer) === -1
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
        return 'Try again, "' + str + '" is not present in ' + Words.theThreeWords;
        // $('#answer_validity').text('Try again, "' + str + '" is not present in ' + Words.theThreeWords)
        // return false;
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
        return 'Try again, "' +str+ '" is only present ' + countInThreeWords + text + ' in ' + Words.theThreeWords;
      }
      // sweet way found: returns an array with all occurences of the regexp
      // need create a new regexps as I cannot hardoce, as in eg for 'o': str.match(/o/g).length
      // add || [] because regexp return null if no matches
    }
    return true
  }

}  // End Answer Object




























