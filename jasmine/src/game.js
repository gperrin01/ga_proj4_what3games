// $(document).ready(function(){

//   // event listeners
//   $('#submit_answer').on('click', submitAnswer)
// })



var Answer = Answer || {};

Answer = {

  compareWith: "belt parts remain",

  // // Return true if all checks pass, return error msg at first error
  isValid: function(answer) {
    return ( Answer.isLongEnough(answer) ) ? true : alert('Invalid, answer must be three or more characters')

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

  // All letters in the word must be in one of the 3 words
  hasValidLetters: function(answer) {
    for (var i = 0; i < answer.length; i++){
      if (Answer.compareWith.indexOf( answer.charAt(i) ) === -1) {
        return false;
      }
    }
    return true;
  }

}





function submitAnswer(){
  event.preventDefault();

  // get dictionnary API to ensure the word exists

  // check words only has letters from the three words, and in the allowed amount


  console.log(event);
  console.log(this);
  console.log('submitting answer');
}






















