class Answer < ActiveRecord::Base

  belongs_to :user
  belongs_to :location


  def only_add_if_best_at_this_location three_words, user 
    # If 3words describe a new location, then it is the best answer at this location & we create the location
    if Location.where(three_words: three_words).length === 0
      self.save 
      location = Location.create three_words: three_words
      location.answers << self
      user.answers << self
    else
      # get curr_user's best answer at this location (ie the only one)
      # if new amswer is better then save it and add it to location and user
      location = Location.where(three_words: three_words).first
      if self.points > user.answers.where(location_id: location.id).first.points 
        self.save
        location.answers << self
        user.answers << self 
      end
    end      
  end



end
