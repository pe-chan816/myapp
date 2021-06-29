class HomeController < ApplicationController
  def home
    if logged_in?
=begin
      created_table = Tweet.joins(:user).select("content,
                                                 tweets.created_at,
                                                 tweets.id,
                                                 tweet_image,
                                                 users.id AS user_id,
                                                 users.name,
                                                 users.profile_image")

      tweet_items = created_table.where("(user_id = ?) OR (user_id = ?)",
                                          current_user.id ,current_user.following_ids)
=end
      users = User.where("(id = ?) OR (id = ?)",
                          current_user.id, current_user.following_ids)
      tweet_items = Tweet.where("(user_id = ?) OR (user_id = ?)",
                                  current_user.id, current_user.following_ids)
      render json: {tweets: tweet_items, users: users }
    end
  end
end
