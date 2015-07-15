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

      # Else if curr_user's new amswer is better than the existing one, or if it's the 1st answer here
      # save the new one and add it to location and user, & delete the existing one
      location = Location.where(three_words: three_words).first
      existing_answer = user.answers.where(location_id: location.id).first 
      if !existing_answer || self.points > existing_answer.points 
        existing_answer.delete if existing_answer
        self.save
        location.answers << self
        user.answers << self 
      end
    end      
  end



end
