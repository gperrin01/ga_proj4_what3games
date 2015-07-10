// SPECS
// DONE
// Word must be >= 3 letters 
// 3 - Word cannot be any of the 3 words, 
// cannot be the singular of any wordnor the singular of them
// nor the basic plural +s
// 2 - Word cannot use a letter which is not in the 3 words

// TO DO
// 4 - Count of letter in the Word cannot be higher than cumulated count of same letter in the 3 words
// 1 - Word must be a real word, checked by an API

describe("Answer returned by the user", function() {

  //  reminder of testWords: "belt parts remain",

  var answer;
  // For each test, pass a new value of answer into the function and ensure the test passes

  it("exists in the google dictionary", function(){
    expect(Answer.isInDictionary('test')).toBe(true)
  })

  xit("cannot be less than 3 characters", function() {
    expect(Answer.isValid('p')).toBe(false);
  });

  xit("cannot be one of the 3 words", function(){
    expect(Answer.isValid('parts')).toBe(false);
  });

  xit("cannot be the basic plural of either of the 3 words", function(){
    expect(Answer.isValid('belts')).toBe(false);
  });

  xit("cannot be the basic singular of either of the 3 words", function(){
    expect(Answer.isValid('part')).toBe(false);
  });

  xit("can only use letters present in the 3 words", function(){
    expect(Answer.isValid('belly')).toBe(false);
  })

  xit(", each letter can only be used multiple times if it present multiple times in the three words", function(){
    expect(Answer.isValid('beeeeeeeellll')).toBe(false);
  })





});