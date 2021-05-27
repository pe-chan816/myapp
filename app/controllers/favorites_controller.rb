class FavoritesController < ApplicationController
  def create
    @tweet = Tweet.find(params[:favorite_tweet_id])
    Favorite.create(user_id: current_user.id, tweet_id: @tweet.id)
    respond_to do |format|
      format.html {redirect_to root_path}
      format.js
    end
  end

  def destroy
    @tweet = Tweet.find(params[:tweet_id])
    Favorite.find_by(user_id: current_user.id, tweet_id: @tweet.id).destroy
    respond_to do |format|
      format.html {redirect_to root_path}
      format.js
    end
  end
end
