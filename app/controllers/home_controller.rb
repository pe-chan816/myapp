class HomeController < ApplicationController
  def home
    if logged_in?
      @tweet = current_user.tweets.build
      @tweet_items = current_user.timeline.page(params[:page]).per(20)
    end
  end
end
