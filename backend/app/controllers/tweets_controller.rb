class TweetsController < ApplicationController
  before_action :user_must_log_in, only:[:create, :destroy]
  before_action :correct_user, only:[:destroy]

  def create
    @tweet = current_user.tweets.build(tweet_params)
    if @tweet.save
      render json: {message: "メッセージ投稿！"}
    else
      render json: {message: "メッセージ投稿失敗..."}
    end
  end

  def destroy
    @tweet.destroy
    flash[:success] = "ツイートを削除しました"
    redirect_to request.referrer || root_path
  end

  def show
    tweet = Tweet.find(params[:id])
    user = tweet.user
    favorite_count = tweet.favorites.count
    favorite_or_not = tweet.favorited?(current_user)
    render json: {tweet: tweet,
                  user: user,
                  favorite_count: favorite_count,
                  favorite_or_not: favorite_or_not}
  end

  def favorite
    tweet = Tweet.find(params[:id])
    favorited_users = tweet.user_favorited
    favorite_count = favorited_users.count

    render json: {favorited_users: favorited_users,
                  favorite_count: favorite_count}
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
