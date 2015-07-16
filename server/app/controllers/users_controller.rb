class UsersController < ApplicationController

  def add_points
    current_user.update_points params[:points].to_i
    render json: current_user
  end

  def get_rankings
    response = {}
    response['user_rank'] = current_user.ranking_global
    response['top5_score'] = current_user.top5_score_global

    response['top5_answers'] = current_user.top5_answers_global

    location_id = Location.where(three_words: params[:words]).first
    response['user_rank_here'] = current_user.ranking_here(location_id)
    response['top5_here'] = current_user.top5_answers(location_id)

    render json: response
  end


  private
  def current_user
    User.find_by authentication_token: params[:authentication_token]
  end

end
