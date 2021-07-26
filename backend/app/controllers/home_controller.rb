class HomeController < ApplicationController
  def home
    if logged_in?
      ## カウント ##
      all_data = Tweet.where("(user_id = ?) OR (user_id =?)",
                               current_user.id, current_user.following_ids.join(","))
      data_count = all_data.count
      ############

      ## ツイートの中身 ##
      base_data = Tweet.left_joins(:user,:hashtags)\
                       .select("tweets.*, users.name, users.profile_image, hashtags.hashname")
                       .where("(user_id = ?) OR (user_id =?)",
                               current_user.id, current_user.following_ids.join(","))
                       .page(params[:page] ||= 1).per(15)#######

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

      #################

      render json: {home_data: data,
                    home_data_count: data_count}##########
    end
  end
end
