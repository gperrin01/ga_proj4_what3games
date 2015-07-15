require 'rails_helper'


RSpec.describe Answer, type: :model do

  let(:user){User.create :email => 'test@example.com', :password => 'password', :password_confirmation => 'password'}
  let(:answer){Answer.create :word => 'test', :points => 5}
  let(:answer2){Answer.new :word => 'another', :points => 2}

  let(:location){Location.create :three_words => 'test another thing'}

  # xit "updates the user score immediately" do 
  #   # can this really be tested? it is not part of the model but of the answer_Controller!
  # end

  it "will be saved if it happened in a new location" do 
    location2 = Location.new :three_words => "one two three"
    answer2.only_add_if_best_at_this_location(location2.three_words, user)
    expect(answer2.save).to be true
  end

  it "creates a new location if it happened in a new location" do 
    location2 = Location.new :three_words => "one two three"
    answer2.only_add_if_best_at_this_location(location2.three_words, user)
    expect(user.locations.length).to eq 1
  end

  it "will not be saved if it is not the best answer for the current_user at this location" do 
    # sign_in user
    location.answers << answer
    user.answers << answer
    answer2.only_add_if_best_at_this_location(location.three_words, user)

    # check that the answer is in the table is the one with 'test', not 'another'
    expect(user.answers.where(location_id: location.id).first.word).to eq 'test'
  end

  it "will be added anyway if it is the first answer for this user" do 
    answer3 = Answer.new :word => 'winner', :points => 12
    answer3.only_add_if_best_at_this_location(location.three_words, user)
    expect(user.answers.where(location_id: location.id).first.word).to eq 'winner'
  end

  it "will replace the current best answer at this location if it has a higher score" do 
    location.answers << answer
    user.answers << answer

    answer3 = Answer.new :word => 'winner', :points => 12
    answer3.only_add_if_best_at_this_location(location.three_words, user)

    # check that the answer is in the table is the one with 'test', not 'another'
    expect(user.answers.where(location_id: location.id).first.word).to eq 'winner'
  end

  it "when added the right way, there can never be more than 1 answer per user per location" do 
    answer3 = Answer.new :word => 'winner', :points => 12
    answer.only_add_if_best_at_this_location(location.three_words, user)
    answer2.only_add_if_best_at_this_location(location.three_words, user)
    answer3.only_add_if_best_at_this_location(location.three_words, user)

    expect(user.answers.where(location_id: location.id).first.word).to eq 'winner'
  end

end
