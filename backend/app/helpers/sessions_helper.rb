module SessionsHelper

  # ログイン処理
  def log_in(user)
    session[:user_id] = user.id
  end

  # :remember_digest を保存し、cookies に user.id と remember_token を保存する
  def remember(user)
    user.remember
    cookies.permanent.signed[:user_id] = user.id
    cookies.permanent[:remember_token] = user.remember_token
  end

  # クッキーを消去する
  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end

  # 現在のユーザーが誰かを確認
  def current_user
    if session[:user_id]
      @current_user ||= User.find_by(id: session[:user_id])
    elsif cookies.signed[:user_id]
      user = User.find_by(id: cookies.signed[:user_id])
      if user && user.authenticated?(cookies[:remember_token])
        log_in user
        @current_user = user
      end
    end
  end

  # ログイン中のユーザーかどうか確認
  def are_you_current_user?(user)
    user == current_user
  end

  # current_userがadminユーザーかどうか確認
  def are_you_admin?
    current_user == User.find_by( admin: true )
  end

  # ユーザーがログイン中か確認
  def logged_in?
    ! current_user.nil?
  end

  # ログアウト処理
  def log_out
    forget(current_user)
    session.delete(:user_id)
    current_user = nil
  end

  # アクセスしようとしていたURLを記憶
  def store_location
    session[:fowarding_url] = request.original_url if request.get?
  end

  # 記憶していたURL（もしくはデフォルトURL）にリダイレクトする
  def redirect_back_or(default)
    redirect_to(session[:fowarding_url] || default)
    session.delete(:fowarding_url)
  end

end
