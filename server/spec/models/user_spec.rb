require 'rails_helper'
# require_relative 'answer_spec'       
# require_relative 'location_spec'       


RSpec.describe User, type: :model do

  let(:user){User.create :email => 'test@example.com', :password => 'password', :password_confirmation => 'password'}
  let(:user2){User.create :email => 'tet@example.com', :password => 'password', :password_confirmation => 'password'}
  let(:user3){User.create :email => 'st@example.com', :password => 'password', :password_confirmation => 'password'}
  let(:answer){Answer.create :word => 'test this thing', :points => 5}
  let(:answer2){Answer.create :word => 'test another thing', :points => 2}

   it 'is created with score of 0' do
      expect(user['score']).to eq 0
    end

    it 'can add points to their score' do
      user.update_score 5
      expect(user['score']). to eq 5
    end

    it 'can have a ranking' do 
      user.update_score 10
      user2.update_score 3
      user3.update_score 20
      # binding.pry
      expect(user3.global_ranking). to eq 1
      expect(user2.global_ranking). to eq 3
    end

    it 'can count the number of answers given' do 
      user.answers << answer
      user.answers << answer2
      expect(user.count_answers).to eq 2
    end

end
