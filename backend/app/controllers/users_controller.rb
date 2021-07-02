class UsersController < ApplicationController
  #before_action :user_must_log_in, only:[:edit, :update, :index, :destroy]
  #before_action :correct_user, only:[:edit, :update]

  def new
    @user = User.new(session[:new_user_params] || {})
    session[:new_user_params] = nil
  end

  def create
    @user = User.new(user_params)

    if @user.save
      log_in(@user)
      render json: {status: :created, user: @user}
    else
      render json: {status: 500}
    end
  end

=begin
  def create
    @user = User.new(user_params)
    if @user.save
      log_in(@user)
      flash[:notice] = 'ようこそいらっしゃいました'
      redirect_to user_url(@user)
    else
      session[:new_user_params] = @user.attributes.slice(*user_params.keys)
      flash[:danger] = @user.errors.full_messages
      redirect_to signup_path
    end
  end
=end

  def edit
  end

  def update
    @user = User.find(params[:id])
    if @user.update_attributes(user_params)
      render json: {user: @user}
      #redirect_to user_path(@user)
    else
      render json: {messages: @user.errors.full_messages}
      #redirect_to edit_user_path(@user)
    end
  end

  def show
    user = User.find(params[:id])
    followings = user.following
    followings_count = followings.count
    followers = user.followers
    followers_count = followers.count
    tweet_items = user.tweets
    follow_or_not = current_user.following?(user)

    render json: { user: user,
                   tweets: tweet_items,
                   followings: followings,
                   followings_count: followings_count,
                   followers: followers,
                   followers_count: followers_count,
                   follow_or_not: follow_or_not}

  end

  def index
    @users = User.page(params[:page]).per(10)
  end

  def destroy
    User.find(params[:id]).destroy
    render json: { message: "ユーザーアカウントを削除しました"}
  end

  def following
    @user = User.find(params[:id])
    @users = @user.following
  end

  def followers
    @user = User.find(params[:id])
    @users = @user.followers
  end

  def guest
    user = User.find_by(guest: true)
    log_in(user)
    flash[:success] = "ようこそいらっしゃいました"
    redirect_back_or user_path(user)
  end

  def favorite
    @user = User.find(params[:id])
    @favorite_tweets = @user.favorited_tweets
  end

  private
    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation,
                                   :profile_image, :remove_profile_image)
    end

    def correct_user
      @user = User.find(params[:id])
      unless are_you_current_user?(@user)
        flash[:danger] = "ログインしてください"
        redirect_to root_path
      end
    end
end
