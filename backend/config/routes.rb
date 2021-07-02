Rails.application.routes.draw do

  get '/login', to:'sessions#new'
  post '/login', to:'sessions#create'
  delete '/logout', to:'sessions#destroy'
  get '/check_login', to:'sessions#login_check' # react側でログイン状態を追跡するのに必要

  get '/signup', to:'users#new'
  post '/signup', to: 'users#create'
  get '/guest', to:'users#guest'

  post '/unfollow', to:'relationships#unfollow'

  post '/unfavorite', to:'favorites#destroy'

  get '/search', to:'searches#search'

  get '/hashtag/:word', to:'hashtags#show'

  root 'home#home'

  resources :users
  resources :users do
    member do
      get 'following', 'followers', 'favorite'
    end
  end
  resources :tweets, only:[:create, :destroy, :show, :favorite] do
    member do
      get 'favorite'
    end
  end
  resources :relationships, only:[:create]
  resources :favorites, only:[:create]
  resources :hashtags, only:[:index, :edit, :update]
end
