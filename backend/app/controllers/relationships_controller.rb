class RelationshipsController < ApplicationController
  before_action :user_must_log_in

  def create
    user = User.find(params[:followed_id])
    current_user.follow(user)
    number_of_followers = user.followers.count
    render json: {messages: "フォロー成功"
                  number_of_followers: number_of_followers}
  end

  def unfollow
    relationship = current_user.active_relationships.find_by(followed_id: params[:followed_id])
    #user = Relationship.find(params[:id]).followed
    user = Relationship.find(relationship.id).followed
    current_user.unfollow(user)
    number_of_followers = user.followers.count
    render json: {messages: "フォロー解除成功"
                  number_of_followers: number_of_followers}
  end
end
