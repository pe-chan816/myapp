class HomeController < ApplicationController
  def home
    if logged_in?
      base_data = Tweet.left_joins(:user,:hashtags)\
                      .select("tweets.*, users.name, users.profile_image, hashtags.hashname")\
                      .where("(user_id = ?) OR (user_id =?)",
                                current_user.id, current_user.following_ids.join(","))
      array_data = []
      base_data.each do |d|
        user = User.find(d.user_id)
        d.profile_image = user.profile_image
        d.hashname = d.hashtags
        array_data.push(d)
      end

      data = array_data.uniq
=begin
      base_data = Tweet.joins(:user).select("tweets.*, users.name, users.profile_image")\
                                    .where("(user_id = ?) OR (user_id =?)",
                                            current_user.id, current_user.following_ids.join(","))
      data = []
      base_data.each do |d|
        user = User.find(d.user_id)
        d.profile_image = user.profile_image
        data.push(d)
      end
=end
      render json: {home_data: data}
    end
  end
end
