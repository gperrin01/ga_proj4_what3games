Rails.application.routes.draw do

  # for devise registrations: use the controller "registrations"
  devise_for :users, controllers: { registrations: "registrations" }

  
  root 'home#index'

end
