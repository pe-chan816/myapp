class UsersController < ApplicationController
  #before_action :user_must_log_in, only:[:edit, :update, :index, :destroy]
  #before_action :correct_user, only:[:edit, :update]

  def new
    @user = User.new(session[:new_user_params] || {})
    session[:new_user_params] = nil
  end

  def create
    user = User.new(user_params)

    if user.save
      log_in(user)
      render json: {status: :created, user: user}
    else
      render json: {messages: user.errors.full_messages}
    end
  end

  def edit
  end

  def update
    user = User.find(params[:id])
    if user.update_attributes(user_params)
      render json: {user: user}
    else
      render json: {messages: user.errors.full_messages}
    end
  end

  def show
    user = User.find(params[:id])

    ## カウント ##
    all_data = Tweet.where("user_id = ?", user.id)
    data_count = all_data.count
    ############

    ## 表示データ ##
    base_data = Tweet.left_joins(:user,:hashtags)
                     .select("tweets.*, users.name, users.profile_image, hashtags.hashname")
                     .where("user_id = ?", user.id)
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
    followings = user.following
    followings_count = followings.count
    followers = user.followers
    followers_count = followers.count
    follow_or_not = current_user.following?(user)

    #############

    render json: { mypage_data_count: data_count,
                   user: user,
                   mypage_data: data,
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
    render json: { user: user}
  end

  def favorite
    @user = User.find(params[:id])
    @favorite_tweets = @user.favorited_tweets
  end

  private
    def user_params
      params.require(:user).permit(:email,
                                   :name,
                                   :password,
                                   :password_confirmation,
                                   :profile_image,
                                   :remove_profile_image,
                                   :self_introduction)
    end

    def correct_user
      @user = User.find(params[:id])
      unless are_you_current_user?(@user)
        flash[:danger] = "ログインしてください"
        redirect_to root_path
      end
    end
end
