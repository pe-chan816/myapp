class TweetsController < ApplicationController
  before_action :user_must_log_in, only:[:create, :destroy]
  before_action :correct_user, only:[:destroy]

  def create
    @tweet = current_user.tweets.build(tweet_params)
    if @tweet.save
      flash[:success] = "You've got tweeted!"
      redirect_to root_path
    else
      redirect_to root_path
    end
  end

  def destroy
    @tweet.destroy
    flash[:success] = "ツイートを削除しました"
    redirect_to request.referrer || root_path
  end

  private
  def tweet_params
    params.require(:tweet).permit(:content, :tweet_image)
  end

  def correct_user
    @tweet = current_user.tweets.find(params[:id])
    if @tweet.nil?
      flash[:danger] = "ツイートがありません"
      redirect_to root_path
    end
  end
end
