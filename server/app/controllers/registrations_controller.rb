class RegistrationsController < Devise::RegistrationsController

  def create
    build_resource(sign_up_params)
    resource.save

    if resource.persisted?
      render json: ["your account has been successfully created"]
    else
      render status: 422, json: resource.errors.full_messages
    end
  end

  def sign_up_params
    params.require(:registration).permit(:email, :password, :password_confirmation)
  end


end
