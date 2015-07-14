class Location < ActiveRecord::Base

  has_many :answers
  has_many :users, through: :answers

# # LOCATION is often a start and often an end
#   has_many :journeys_as_start_location, class_name: "Journey", foreign_key: "start_location_id"
#   has_many :journeys_as_end_location, class_name: "Journey", foreign_key: "end_location_id"
#   has_and_belongs_to_many :journeys

  
  def best_answer
    self.answers.order('points desc').first
  end

  def best_answer_word
    self.best_answer['word']
  end

  def best_answer_user
    User.find(self.best_answer.user_id)
  end



end
