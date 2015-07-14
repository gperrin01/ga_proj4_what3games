require 'rails_helper'


RSpec.describe Location, type: :model do

  let(:user){User.create :email => 'test@example.com', :password => 'password', :password_confirmation => 'password'}
  let(:user2){User.create :email => 'tet@example.com', :password => 'password', :password_confirmation => 'password'}
  let(:user3){User.create :email => 'st@example.com', :password => 'password', :password_confirmation => 'password'}
  let(:answer){Answer.create :word => 'test', :points => 5}
  let(:answer2){Answer.create :word => 'another', :points => 2}
  let(:location){Location.create :three_words => 'test another thing'}


  it "can return the best answer for this location" do 
    location.answers << answer << answer2
    expect(location.best_answer_word).to eq 'test'
  end

  it "returns who gave the best answer" do 
    location.answers << answer << answer2
    user.answers << answer
    user2.answers << answer2
    expect(location.best_answer_user['email']).to eq "test@example.com"
  end

end
