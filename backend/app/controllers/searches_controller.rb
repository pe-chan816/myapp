class SearchesController < ApplicationController
  def search
    keyword = params[:search_word]

    ## ユーザー ##
    searched_user = User.where("name LIKE ?", "%#{keyword}%")
    #############

    ## ツイート ##
    base_data = Tweet.joins(:user, :hashtags)
                     .select("tweets.*,
                              hashtags.hashname,
                              users.name, users.profile_image")
                     .where("content LIKE ?", "%#{keyword}%")
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
    searched_tweet = array_data.uniq
    #############

    render json: { searched_user: searched_user,
                   searched_tweet: searched_tweet}
  end
end
