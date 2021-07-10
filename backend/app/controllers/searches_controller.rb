class SearchesController < ApplicationController
  def search
    keyword = params[:search_word]

    searched_user = User.where("name LIKE ?", "%#{keyword}%")

    base_data = Tweet.joins(:user).select("tweets.*, users.name, users.profile_image")\
                                  .where("content LIKE ?", "%#{keyword}%")
    searched_tweet = []
    base_data.each do |d|
      user = User.find(d.user_id)
      d.profile_image = user.profile_image
      searched_tweet.push(d)
    end

    render json: { searched_user: searched_user,
                   searched_tweet: searched_tweet}
  end
end
