class HomeController < ApplicationController
  def home
    if logged_in?
=begin
      users = User.where("(id = ?) OR (id = ?)",
                          current_user.id, current_user.following_ids.join(","))
      tweet_items = Tweet.where("(user_id = ?) OR (user_id = ?)",
                                  current_user.id, current_user.following_ids.join(","))
      render json: {tweets: tweet_items, users: users }
=end
      base_data = Tweet.joins(:user).select("tweets.*, users.name, users.profile_image")\
                                    .where("(user_id = ?) OR (user_id =?)",
                                            current_user.id, current_user.following_ids.join(","))
      data = []
      base_data.each do |d|
        user = User.find(d.user_id)
        d.profile_image = user.profile_image
        data.push(d)
      end
      render json: {home_data: data}
    end
  end
end
