// $(document).ready(function(){

//   // event listeners
//   $('#submit_answer').on('click', submitAnswer)
// })



var Answer = Answer || {};

Answer = {

  compareWith: "belt parts remain",

  isLongEnough: function(answer) {
    return answer.length > 2;
  },
  // true if answer NOT inside of Answer.compareWith
  isNotOneOfThree: function(answer) {
    return Answer.compareWith.indexOf(answer) === -1;
  },
  // remove last letter from answer and check result isn't one of the 3 words
  isNotBasicPlural: function(answer) {
    return Answer.isNotOneOfThree( answer.slice(0,-1) );
  },
  // add a final 's' to word and check result isn't of the 3 words
  isNotBasicSingular: function(answer) {
    return Answer.isNotOneOfThree(answer + 's');
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






















