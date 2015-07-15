Rails.application.routes.draw do

  # for devise registrations: use the controller "registrations"
  devise_for :users, controllers: { 
    registrations: "registrations",
    sessions: "sessions"
  }


  root 'home#index'

end
