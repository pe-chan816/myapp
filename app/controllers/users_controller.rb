class UsersController < ApplicationController
  before_action :user_must_log_in, only:[:edit, :update, :index]
  before_action :correct_user, only:[:edit, :update]

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
  end

  def index
    @users = User.page(params[:page]).per(10)
  end

  private
    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end

    def user_must_log_in
      unless logged_in?
        store_location
        flash[:danger] = "ログインしてください"
        redirect_to login_path
      end
    end

    def correct_user
      @user = User.find(params[:id])
      flash[:danger] = "ログインしてください"
      redirect_to root_path unless are_you_current_user?(@user)
    end
end
