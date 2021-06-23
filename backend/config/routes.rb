Rails.application.routes.draw do

  get '/login', to:'sessions#new'
  post '/login', to:'sessions#create'
  delete '/logout', to:'sessions#destroy'


  get '/logged_in', to:'sessions#logged_in?' # react側でログイン状態を追跡するのに必要
  get '/signup', to:'users#new'
  post '/signup', to: 'users#signup' # お試し イケそうならusers#create で
  get '/guest', to:'users#guest'

  get '/search', to:'searches#search'

  get '/hashtag/:word', to:'hashtags#show'

  root 'home#home'

  resources :users
  resources :users do
    member do
      get 'following', 'followers', 'favorite'
    end
  end
  resources :tweets, only:[:create, :destroy, :favorite] do
    member do
      get 'favorite'
    end
  end
  resources :relationships, only:[:create, :destroy]
  resources :favorites, only:[:create, :destroy]
  resources :hashtags, only:[:index, :edit, :update]
end
