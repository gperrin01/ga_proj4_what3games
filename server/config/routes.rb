Rails.application.routes.draw do

  # for devise registrations: use the controller "registrations"
  devise_for :users, controllers: { 
    registrations: "registrations",
    sessions: "sessions"
  }

  # when get requeset sent to users/tokenxyz, trigger controller sessions, method show
  devise_scope :user do
    get "users/:authentication_token", to: "sessions#show"
    delete "users/:authentication_token", to: "sessions#destroy"
  end

  post 'answers', to: 'answers#create'

  put 'users/:authentication_token', to: 'users#add_points'

  root 'home#index'

end
