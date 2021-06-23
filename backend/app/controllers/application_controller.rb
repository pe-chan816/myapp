class ApplicationController < ActionController::Base
  include SessionsHelper

  # reactでは利用できないのでrailsのcsrf対策をスキップ
  skip_before_action :verify_authenticity_token

  private
  def user_must_log_in
    unless logged_in?
      store_location
      flash[:danger] = "ログインしてください"
      redirect_to login_path
    end
  end
end
