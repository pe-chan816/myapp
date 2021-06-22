class ApplicationController < ActionController::Base
  include SessionsHelper

  private
  def user_must_log_in
    unless logged_in?
      store_location
      flash[:danger] = "ログインしてください"
      redirect_to login_path
    end
  end
end
