require 'rails_helper'


RSpec.describe Answer, type: :model do

  let(:user){User.create :email => 'test@example.com', :password => 'password', :password_confirmation => 'password'}
  let(:answer){Answer.create :word => 'test', :points => 5}
  let(:answer2){Answer.new :word => 'another', :points => 2}

  let(:location){Location.create :three_words => 'test another thing'}

  xit "updates the user score immediately" do 
    # can this really be tested? it is not part of the model but of the answer_Controller!
  end

  xit "will not be saved if it is not the best answer for the current_user at this location" do 
    # sign_in :user, user
    sign_in user
    location.answers << answer
    user.answers << answer

    # answer2 = Answer.new :word => 'another', :points => 2
    answer2.only_add_if_best_at_this_location(location.three_words, user)
    expect(answer2.save).to be false
    expect(Answer.all.length).to eq 1
  end

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

end
