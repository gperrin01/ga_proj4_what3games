require 'rails_helper'
# require_relative 'answer_spec'       
# require_relative 'location_spec'       


RSpec.describe User, type: :model do

  let(:user){User.create :email => 'test@example.com', :password => 'password', :password_confirmation => 'password'}
  let(:user2){User.create :email => 'tet@example.com', :password => 'password', :password_confirmation => 'password'}
  let(:user3){User.create :email => 'st@example.com', :password => 'password', :password_confirmation => 'password'}
  let(:answer){Answer.create :word => 'test', :points => 5}
  let(:answer2){Answer.create :word => 'another', :points => 2}
  let(:answer3){Answer.create :word => 'another', :points => 4}
  let(:location){Location.create :three_words => 'test another thing'}
  # let(:journey){Journey.create :start => 'start', :finish => 'finish', :bonus_points => 6}

    it "has a score of zero on creation" do 
      expect(user.calc_score). to eq 0
    end

    it "updates its score once an answer is logged" do
      user.answers << answer
      user.answers << answer2
      expect(user.calc_score).to eq 7
    end

    it 'can count the number of answers given' do 
      user.answers << answer
      user.answers << answer2
      expect(user.count_answers).to eq 2
    end

    it 'can add bonus_points (at the end of a journey)' do
      user.update_bonus_points 5
      expect(user['bonus_points']).to eq 5
    end

    it 'can have a ranking' do 
      user.update_bonus_points 10
      user2.update_bonus_points 3
      user3.update_bonus_points 20
      expect(user3.global_ranking).to eq 1
      expect(user2.global_ranking).to eq 3
    end

    it "only keeps their best answer per location" do 
      # if a user submitted two answers at one location, we would only keep the best one
      location.answers << answer
      user.answers << answer
      user.add_but_only_keep_best(answer2, location)
      user.add_but_only_keep_best(answer3, location)
      expect(user.answers.where(location_id: location['id']).first.word).to eq 'test'
    end

    it "can log the first answer for a loaction and pass the test" do 
      user.add_but_only_keep_best(answer, location)
      expect(user.answers.where(location_id: location['id']).first.word).to eq 'test'
    end


    # JOURNEYS TO COME LATER
    # it 'earns bonus points after winning a journey' do
    #   user.journeys << journey
    #   expect(user.score). to eq 6
    # end

end
