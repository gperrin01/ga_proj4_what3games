class AnswersController < ApplicationController


  # before_action :authenticate_user

  def create
    # whatever happens we update the user score
    current_user.update_points params[:points].to_i

    # prepare the answer for all the checks: to be saved, it needs to be the user's best answer at this location
    answer = Answer.new points: params[:points].to_i, word: params[:word]
    # Location.find_or_create_by(three_words: params[:threeWords])
    answer.only_add_if_best_at_this_location(params[:threeWords], current_user)
    
    render json: answer
  end

  private
  def current_user
    User.find_by authentication_token: params[:authentication_token]
  end

end
