class UsersController < ApplicationController

  def add_points
    current_user.update_points params[:points].to_i
    render json: current_user
  end

  private
  def current_user
    User.find_by authentication_token: params[:authentication_token]
  end

end
