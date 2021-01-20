Rails.application.routes.draw do
  get 'test/test'
  get '/signup', to:'user#new'
  root 'home#home'
end
