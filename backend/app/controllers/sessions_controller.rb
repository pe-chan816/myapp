class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      log_in user
      remember(user)
      render json: { logged_in: ture, user: user}
      #redirect_back_or user_path(user)
    else
      render json: {
        status: 401,
        errors: ["認証に失敗しました", "正しいメールアドレス・パスワードを入力し直すか、新規登録を行ってください"]}
      #render 'new'
    end
  end

  def destroy
    log_out if logged_in?
    render json: {status: 200, logged_in: false}
    #redirect_to root_path
  end

  # reactにログイン状態を伝えるためのアクション
  def logged_in?
    if logged_in?
      render json: {logged_in: true, user: current_user}
    else
      render json: {logged_in: false, message: "ユーザーが存在しません"}
    end
  end
end
