class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      log_in user
      remember(user)
      flash[:notice] = 'ようこそいらっしゃいました'
      redirect_to user_path(user)
    else
      flash.now[:danger] = 'emailとpasswordの組み合わせが正しくありません'
      render 'new'
    end
  end

  def destroy
    log_out if logged_in?
    redirect_to root_path
  end
end
