class HomeController < ApplicationController
  def home
    render json: User.find_by(guest: true)
    #if logged_in?
    #  @tweet = current_user.tweets.build
    #  @tweet_items = current_user.timeline.page(params[:page]).per(20)
    #end
  end
end
