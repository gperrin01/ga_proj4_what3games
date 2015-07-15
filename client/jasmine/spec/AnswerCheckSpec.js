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

  // run tests against these dummy three words
  User.theThreeWords = "belt parts remain";

  it("exists in the dictionary", function() {
    expect(Answer.isValid('test', Answer.isInDictionary)).toBe(true)
  });

  it("cannot be less than 3 characters", function() {
    expect(Answer.isValid('te', Answer.isInDictionary)).toBe(false);
  });

  it("cannot be one of the 3 words", function(){
    expect(Answer.isValid('parts')).toBe(false);
  });

  it("cannot be the basic plural of either of the 3 words", function(){
    expect(Answer.isValid('belts')).toBe(false);
  });

  it("cannot be the basic singular of either of the 3 words", function(){
    expect(Answer.isValid('part')).toBe(false);
  });

  it("can only use letters present in the 3 words", function(){
    expect(Answer.isValid('belly')).toBe(false);
  })

  it(", each letter can only be used multiple times if it present multiple times in the three words", function(){
    expect(Answer.isValid('beeeeeeeellll')).toBe(false);
  })





});