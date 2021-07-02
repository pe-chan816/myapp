class HomeController < ApplicationController
  def home
    if logged_in?
      users = User.where("(id = ?) OR (id = ?)",
                          current_user.id, current_user.following_ids)
      tweet_items = Tweet.where("(user_id = ?) OR (user_id = ?)",
                                  current_user.id, current_user.following_ids)
      render json: {tweets: tweet_items, users: users }
    end
  end
end
