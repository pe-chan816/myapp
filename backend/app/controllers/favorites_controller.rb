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

    ## my_favorites_count ##
    all_data = user.favorited_tweets
    data_count = all_data.count

    ## my_favorites ##
    base_data = Tweet.left_joins(:user, :hashtags, :favorites)
                     .select("tweets.*,
                              users.name, users.profile_image,
                              hashtags.hashname,
                              favorites.user_id AS favorite_user_id")
                     .where("favorites.user_id = ?", user.id)
    array_data = []
    base_data.each do |d|
      user = User.find(d.user_id)
      tweet = Tweet.find(d.id)
      d.profile_image = user.profile_image
      d.hashname = d.hashtags
      ##############
      new_d = d.attributes.merge("favorite_count" => d.favorites.count,
                                 "fav_or_not" => d.favorited?(current_user))
      new_d2 = new_d.merge("tweet_image" => tweet.tweet_image,
                           "created_at" => tweet.created_at.strftime("%-H:%M %Y/%m/%d"))
      ##############
      array_data.push(new_d2)
    end
    data = array_data.uniq

    render json: { my_favorites_count: data_count,
                   my_favorites: data}
  end
end
