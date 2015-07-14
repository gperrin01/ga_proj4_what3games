require 'rails_helper'

RSpec.describe User, type: :model do

  let(:user){User.create :email => 'test@example.com', :password => 'password', :password_confirmation => 'password'}
  let(:user2){User.create :email => 'tet@example.com', :password => 'password', :password_confirmation => 'password'}
  let(:user3){User.create :email => 'st@example.com', :password => 'password', :password_confirmation => 'password'}


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
      expect(user.global_ranking). to eq 2
    end


end
