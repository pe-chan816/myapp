class UsersController < ApplicationController
  before_action :user_must_log_in, only:[:edit, :update, :index, :destroy]
  before_action :correct_user, only:[:edit, :update]
  #before_action :admin_user, only: :destroy

  def new
    @user = User.new(session[:new_user_params] || {})
    session[:new_user_params] = nil
  end

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

  def edit
    #@user = User.find(params[:id])
  end

  def update
    #@user = User.find(params[:id])
    if @user.update_attributes(user_params)
      redirect_to user_path(@user)
    else
      redirect_to edit_user_path(@user)
    end
  end

  def show
    @user = User.find(params[:id])
    @tweet_items = @user.tweets.page(params[:page]).per(10)
  end

  def index
    @users = User.page(params[:page]).per(10)
  end

  def destroy
    User.find(params[:id]).destroy
    flash[:success] = "ユーザー情報を削除いたしました"
    redirect_to users_path
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
    user = User.find_by(email: "i_am_guest_user@email.com")
    log_in(user)
    flash[:success] = "ようこそいらっしゃいました"
    redirect_back_or user_path(user)
  end

  private
    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation,
                                   :profile_image, :remove_profile_image)
    end

    def correct_user
      @user = User.find(params[:id])
      flash[:danger] = "ログインしてください"
      redirect_to root_path unless are_you_current_user?(@user)
    end

    #def admin_user
    #  unless current_user.admin? then
    #  redirect_to root_path
    #  flash[:danger] = "情報変更の権限がありません"
    #  end
    #end
end
