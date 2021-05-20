class RelationshipsController < ApplicationController
  before_action :user_must_log_in

  def create
    @user = User.find(params[:followed_id])
    current_user.follow(@user)
    respond_to do |format|
      format.html {redirect_to root_path}
      format.js
    end
  end

  def destroy
    @user = Relationship.find(params[:id]).followed
    current_user.unfollow(@user)
    respond_to do |format|
      format.html {redirect_to root_path}
      format.js
    end
  end
end
