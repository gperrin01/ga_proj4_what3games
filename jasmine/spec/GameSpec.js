// SPECS
// 1 - Word must be a real word, checked by an API
// Word must be >= 3 letters
// 2 - Word cannot use a letter which is not in the 3 words
// 3 - Word cannot be any of the 3 words, nor the singular of them
// 4 - Count of letter in the Word cannot be higher than cumulated count of same letter in the 3 words

describe("Word returned by the user", function() {

  var answer;
  // For each test, pass a new value of answer into the function and ensure the test passes

  it("should be 3 or more characters", function() {
    expect(Word.isLongEnough('qz')).toBe(true);
  });

});