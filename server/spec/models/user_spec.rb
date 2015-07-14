require 'rails_helper'

RSpec.describe User, type: :model do

  let(:user){User.new}

    it 'is created with score of 0' do
      expect(user['score']).to eq 0
    end

    it 'can add points to their score' do
      user.update_score 5
      expect(user['score']). to eq 5
    end


end
