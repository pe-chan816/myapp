Rails.application.routes.draw do

  get '/login', to:'sessions#new'
  post '/login', to:'sessions#create'
  delete '/logout', to:'sessions#destroy'

  get '/signup', to:'users#new'

  root 'home#home'

  resources :users
  resources :tweets, only:[:create, :destroy]
end
