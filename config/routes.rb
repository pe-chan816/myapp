Rails.application.routes.draw do

  get '/login', to:'sessions#new'
  post '/login', to:'sessions#create'
  delete '/logout', to:'sessions#destroy'

  get '/signup', to:'users#new'
  get '/guest', to:'users#guest'

  root 'home#home'

  resources :users
  resources :users do
    member do
      get 'following', 'followers'
    end
  end
  resources :tweets, only:[:create, :destroy]
  resources :relationships, only:[:create, :destroy]
end
