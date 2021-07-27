class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by(email: login_params[:email].downcase)
    if user && user.authenticate(login_params[:password])
      log_in user
      render json: { logged_in: true, user: user}
    else
      render json: { status: 401,
                     errors: ["認証に失敗しました。",
                              "正しいメールアドレス・パスワードを入力し直すか、新規登録を行ってください。"]}
    end
  end

  def destroy
    if logged_in?
      log_out
      render json: {status: 200, logged_in: false}
    elsif
      render json: {message: "ログインユーザーがいません"}
    end
    #redirect_to root_path
  end

  # reactにログイン状態を伝えるためのアクション
  def login_check
    if logged_in?
      render json: {logged_in: true, user: current_user}
    else
      render json: {logged_in: false, message: "ユーザーが存在しません"}
    end
  end

  private
  def login_params
    params.require(:user).permit(:email, :password)
  end
end
