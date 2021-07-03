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

  def my_favorite
    user = User.find(params[:id])
    base_data = Tweet.joins(:user).select("tweets.*, users.name, users.profile_image").where(user_id: user.id)
    data = []
    base_data.each do |d|
      d.profile_image = user.profile_image
      data.push(d)
    end
    render json: {my_favorites: data}
  end
end
