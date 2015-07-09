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
  isNotOneOfThree: function(answer) {
    // true if answer NOT inside of Answer.compareWith
    return Answer.compareWith.indexOf(answer) === -1
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






















