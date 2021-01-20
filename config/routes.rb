Rails.application.routes.draw do
  get '/signup', to:'users#new'
  root 'home#home'
  resources :users
end
