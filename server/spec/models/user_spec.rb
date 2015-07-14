require 'rails_helper'

RSpec.describe User, type: :model do

  let(:user){User.new}

    it 'is created with score of 0' do
      expect(user.score).to eq 0
    end


end
