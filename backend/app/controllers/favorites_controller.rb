class FavoritesController < ApplicationController
  def create
    tweet = Tweet.find(params[:favorite_tweet_id])
    Favorite.create(user_id: current_user.id, tweet_id: tweet.id)

    render json: {message: "いいね！"}
  end

  def destroy
    tweet = Tweet.find(params[:tweet_id])
    Favorite.find_by(user_id: current_user.id, tweet_id: tweet.id).destroy

    render json: {message: "いいね解除"}
  end
end
