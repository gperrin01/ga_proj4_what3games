// SPECS
// DONE
// Word must be >= 3 letters 
// 3 - Word cannot be any of the 3 words, 
// cannot be the singular of any wordnor the singular of them
// nor the basic plural +s

// 1 - Word must be a real word, checked by an API
// 2 - Word cannot use a letter which is not in the 3 words
// 4 - Count of letter in the Word cannot be higher than cumulated count of same letter in the 3 words

describe("Answer returned by the user", function() {

  //  reminder of testWords: "belt parts remain",

  var answer;
  // For each test, pass a new value of answer into the function and ensure the test passes

  it("cannot be less than 3 characters", function() {
    expect(Answer.isLongEnough('qz')).toBe(false);
  });
  it("passes if more than 3 characters", function() {
    expect(Answer.isLongEnough('qzq')).toBe(true);
  });

  it("cannot be one of the 3 words", function(){
    answer = 'parts';
    expect(Answer.isNotOneOfThree(answer)).toBe(false);
  });
  it("cannot be the basic plural of either of the 3 words", function(){
    answer = 'belts';
    expect(Answer.isNotBasicPlural(answer)).toBe(false);
  });
  it("cannot be the basic singular of either of the 3 words", function(){
    answer = 'part';
    expect(Answer.isNotBasicSingular(answer)).toBe(false);
  });

});