Rails.application.routes.draw do

  post '/login', to:'sessions#create'
  delete '/logout', to:'sessions#destroy'
  get '/check_login', to:'sessions#login_check' # react側でログイン状態を追跡するのに必要

  ##get '/signup', to:'users#new'
  post '/signup', to: 'users#create'
  get '/guest', to:'users#guest'

  post '/unfollow', to:'relationships#unfollow'

  post '/unfavorite', to:'favorites#destroy'
  get '/users/:id/myfavorite', to:'favorites#my_favorite'

  get '/search/:search_word', to:'searches#search'

  get '/hashtag/:word', to:'hashtags#show'
  post '/hashtag/:word/edit/bar', to:'hashtags#update_bar_info'
  post '/hashtag/:word/edit/recipe', to:'hashtags#update_recipe'
  delete '/hashtag/delete/recipe/:id', to:'hashtags#destroy_recipe'

  root 'home#home'

  resources :users, only: [:create, :update, :show, :destroy]
  resources :users do
    member do
      #get 'following', 'followers', 'favorite'
    end
  end
  resources :tweets, only:[:create, :destroy, :favorite, :index, :show ] do
    member do
      get 'favorite'
    end
  end
  resources :relationships, only:[:create]
  resources :favorites, only:[:create]
  resources :hashtags, only:[:index]
end
