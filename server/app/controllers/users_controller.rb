class UsersController < ApplicationController

  def add_points
    current_user.update_points params[:points].to_i
    render json: current_user
  end

  def get_rankings
    response = {}
    location_id = Location.where(three_words: params[:words]).first

    response['user_rank'] = current_user.ranking_global
    response['user_points'] = current_user.points
    response['n_users'] = User.all.length
    response['user_rank_here'] = current_user.ranking_here(location_id)
    response['my_best'] = current_user.my_best_answer

    response['top3_score'] = current_user.top3_score_global
    response['top3_answers'] = current_user.top3_answers_global
    response['top3_here'] = current_user.top3_answers(location_id)

    render json: response
  end


  private
  def current_user
    User.find_by authentication_token: params[:authentication_token]
  end

end
